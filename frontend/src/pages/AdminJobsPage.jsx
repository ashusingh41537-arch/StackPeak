import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useAdminCompanies from '../hooks/useAdminCompanies'
import useAdminJobs from '../hooks/useAdminJobs'
import { createAdminJob, deleteAdminJob, updateAdminJob } from '../services/adminJobApi'

function JobFormDialog({ title, formValues, companies, isSaving, onChange, onSave, onClose }) {
  return (
    <div className="pp-modal-overlay">
      <form className="pp-modal-card max-h-[85vh] overflow-y-auto" onSubmit={onSave}>
        <h2>{title}</h2>

        <label htmlFor="title">Job Title</label>
        <input id="title" name="title" value={formValues.title} onChange={onChange} required />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formValues.description}
          onChange={onChange}
          required
        />

        <label htmlFor="requirementsText">Requirements (comma separated)</label>
        <input
          id="requirementsText"
          name="requirementsText"
          value={formValues.requirementsText}
          onChange={onChange}
        />

        <label htmlFor="salary">Salary</label>
        <input id="salary" name="salary" type="number" value={formValues.salary} onChange={onChange} required />

        <label htmlFor="experienceLevel">Experience Level (years)</label>
        <input
          id="experienceLevel"
          name="experienceLevel"
          type="number"
          value={formValues.experienceLevel}
          onChange={onChange}
          required
        />

        <label htmlFor="location">Location</label>
        <input id="location" name="location" value={formValues.location} onChange={onChange} required />

        <label htmlFor="jobType">Job Type</label>
        <input id="jobType" name="jobType" value={formValues.jobType} onChange={onChange} required />

        <label htmlFor="position">Open Positions</label>
        <input id="position" name="position" type="number" value={formValues.position} onChange={onChange} required />

        <label htmlFor="companyId">Company</label>
        <select id="companyId" name="companyId" value={formValues.companyId} onChange={onChange} required>
          <option value="">Select company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <div className="pp-action-row">
          <button className="pp-link-btn" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button className="pp-link-btn pp-link-btn-light" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function AdminJobsPage() {
  const token = useSelector((state) => state.auth.token)
  const { jobs, isLoading, errorMessage, reloadJobs } = useAdminJobs(token)
  const { companies } = useAdminCompanies(token)

  const [searchText, setSearchText] = useState('')
  const [locationValue, setLocationValue] = useState('all')
  const [typeValue, setTypeValue] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editJobId, setEditJobId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    requirementsText: '',
    salary: '',
    experienceLevel: '',
    location: '',
    jobType: '',
    position: '',
    companyId: '',
  })

  const locationList = useMemo(() => {
    const values = jobs.map((job) => job.location).filter(Boolean)
    return ['all', ...new Set(values)]
  }, [jobs])

  const typeList = useMemo(() => {
    const values = jobs.map((job) => job.jobType).filter(Boolean)
    return ['all', ...new Set(values)]
  }, [jobs])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = `${job.title || ''} ${job.description || ''} ${job.company?.name || ''}`.toLowerCase()
      const matchesSearch = text.includes(searchText.toLowerCase())
      const matchesLocation = locationValue === 'all' || job.location === locationValue
      const matchesType = typeValue === 'all' || job.jobType === typeValue
      return matchesSearch && matchesLocation && matchesType
    })
  }, [jobs, searchText, locationValue, typeValue])

  function openAddDialog() {
    setActionMessage('')
    setEditJobId('')
    setFormValues({
      title: '',
      description: '',
      requirementsText: '',
      salary: '',
      experienceLevel: '',
      location: '',
      jobType: '',
      position: '',
      companyId: '',
    })
    setIsFormOpen(true)
  }

  function openEditDialog(job) {
    setActionMessage('')
    setEditJobId(job.id)
    setFormValues({
      title: job.title || '',
      description: job.description || '',
      requirementsText: (job.requirements || []).join(', '),
      salary: job.salary ?? '',
      experienceLevel: job.experienceLevel ?? '',
      location: job.location || '',
      jobType: job.jobType || '',
      position: job.position ?? '',
      companyId: job.companyId || '',
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
  }

  function onFormChange(event) {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  function makePayload(values) {
    return {
      title: values.title,
      description: values.description,
      requirements: values.requirementsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      salary: Number(values.salary || 0),
      experienceLevel: Number(values.experienceLevel || 0),
      location: values.location,
      jobType: values.jobType,
      position: Number(values.position || 0),
      companyId: values.companyId,
    }
  }

  async function onFormSave(event) {
    event.preventDefault()
    if (!token) return

    setIsSaving(true)
    setActionMessage('')

    try {
      const payload = makePayload(formValues)
      if (editJobId) {
        const data = await updateAdminJob(token, editJobId, payload)
        setActionMessage(data?.message || 'Job updated.')
      } else {
        const data = await createAdminJob(token, payload)
        setActionMessage(data?.message || 'Job created.')
      }
      await reloadJobs()
      setIsFormOpen(false)
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Job save failed.')
    } finally {
      setIsSaving(false)
    }
  }

  async function onDeleteClick(job) {
    if (!token) return

    const isConfirmed = window.confirm(`Delete "${job.title}"? Ye action undo nahi hoga.`)
    if (!isConfirmed) return

    setActionMessage('')
    try {
      const data = await deleteAdminJob(token, job.id)
      setActionMessage(data?.message || 'Job deleted.')
      await reloadJobs()
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Job delete failed.')
    }
  }

  return (
    <section>
      <div className="pp-section-head">
        <h1 className="pp-page-title">Admin Jobs</h1>
        <button type="button" className="pp-link-btn" onClick={openAddDialog}>
          Create Job
        </button>
      </div>

      <div className="pp-filter-row">
        <input
          className="pp-text-input"
          placeholder="Search by title, description, company..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          className="pp-select-input"
          value={locationValue}
          onChange={(e) => setLocationValue(e.target.value)}
        >
          {locationList.map((location) => (
            <option key={location} value={location}>
              {location === 'all' ? 'All Locations' : location}
            </option>
          ))}
        </select>
        <select className="pp-select-input" value={typeValue} onChange={(e) => setTypeValue(e.target.value)}>
          {typeList.map((type) => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <p className="pp-info-line">Loading admin jobs...</p> : null}
      {errorMessage ? <p className="pp-error-block">{errorMessage}</p> : null}
      {actionMessage ? <p className="pp-info-line">{actionMessage}</p> : null}

      <div className="pp-list">
        {filteredJobs.map((job) => (
          <article className="pp-card" key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.company?.name || 'Unknown Company'}</p>
            <p>
              {job.location} - {job.jobType}
            </p>
            <p>Salary: {job.salary}</p>
            <p>Applicants: {job.applicantsCount || 0}</p>
            <div className="pp-action-row">
              <Link className="pp-link-btn pp-link-btn-small pp-link-btn-light" to={`/admin/jobs/${job.id}/applicants`}>
                Manage Applicants
              </Link>
              <button type="button" className="pp-link-btn pp-link-btn-small" onClick={() => openEditDialog(job)}>
                Update Job
              </button>
              <button
                type="button"
                className="pp-link-btn pp-link-btn-small pp-link-btn-danger"
                onClick={() => onDeleteClick(job)}
              >
                Delete Job
              </button>
            </div>
          </article>
        ))}
      </div>

      {!isLoading && filteredJobs.length === 0 ? (
        <p className="pp-info-line">No job found for current filter.</p>
      ) : null}

      {isFormOpen ? (
        <JobFormDialog
          title={editJobId ? 'Update Job' : 'Create Job'}
          formValues={formValues}
          companies={companies}
          isSaving={isSaving}
          onChange={onFormChange}
          onSave={onFormSave}
          onClose={closeForm}
        />
      ) : null}
    </section>
  )
}

export default AdminJobsPage
