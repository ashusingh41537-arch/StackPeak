import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useAdminCompanies from '../hooks/useAdminCompanies'
import { createCompany, deleteCompany, updateCompany } from '../services/companyApi'

function CompanyFormDialog({ title, formValues, isSaving, onChange, onSave, onClose }) {
  return (
    <div className="pp-modal-overlay">
      <form className="pp-modal-card" onSubmit={onSave}>
        <h2>{title}</h2>

        <label htmlFor="name">Company Name</label>
        <input id="name" name="name" value={formValues.name} onChange={onChange} required />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formValues.description}
          onChange={onChange}
          rows={3}
        />

        <label htmlFor="website">Website</label>
        <input id="website" name="website" value={formValues.website} onChange={onChange} />

        <label htmlFor="location">Location</label>
        <input id="location" name="location" value={formValues.location} onChange={onChange} />

        <label htmlFor="logoFile">Company Logo</label>
        <input id="logoFile" name="logoFile" type="file" accept="image/*" onChange={onChange} />

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

function AdminCompaniesPage() {
  const token = useSelector((state) => state.auth.token)
  const { companies, isLoading, errorMessage, reloadCompanies } = useAdminCompanies(token)
  const [searchText, setSearchText] = useState('')
  const [locationValue, setLocationValue] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editCompanyId, setEditCompanyId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    logoFile: null,
  })

  const locationList = useMemo(() => {
    const uniqueLocations = companies.map((company) => company.location).filter(Boolean)
    return ['all', ...new Set(uniqueLocations)]
  }, [companies])

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const name = (company.name || '').toLowerCase()
      const description = (company.description || '').toLowerCase()
      const website = (company.website || '').toLowerCase()
      const search = searchText.toLowerCase()

      const matchesSearch =
        name.includes(search) || description.includes(search) || website.includes(search)

      const matchesLocation =
        locationValue === 'all' || (company.location || '') === locationValue

      return matchesSearch && matchesLocation
    })
  }, [companies, searchText, locationValue])

  function openAddDialog() {
    setActionMessage('')
    setEditCompanyId('')
    setFormValues({
      name: '',
      description: '',
      website: '',
      location: '',
      logoFile: null,
    })
    setIsAddOpen(true)
  }

  function openEditDialog(company) {
    setActionMessage('')
    setEditCompanyId(company.id)
    setFormValues({
      name: company.name || '',
      description: company.description || '',
      website: company.website || '',
      location: company.location || '',
      logoFile: null,
    })
    setIsAddOpen(true)
  }

  function closeDialog() {
    setIsAddOpen(false)
  }

  function onFormChange(event) {
    const { name, value, files } = event.target
    if (name === 'logoFile') {
      setFormValues((prev) => ({ ...prev, logoFile: files?.[0] || null }))
      return
    }
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  async function onFormSave(event) {
    event.preventDefault()
    if (!token) return

    setIsSaving(true)
    setActionMessage('')
    try {
      if (editCompanyId) {
        const data = await updateCompany(token, editCompanyId, formValues)
        setActionMessage(data?.message || 'Company updated.')
      } else {
        const data = await createCompany(token, formValues.name)
        setActionMessage(data?.message || 'Company added.')
      }
      await reloadCompanies()
      setIsAddOpen(false)
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Company save failed.')
    } finally {
      setIsSaving(false)
    }
  }

  async function onDeleteClick(company) {
    if (!token) return

    const isConfirmed = window.confirm(
      `Delete "${company.name}"? Ye action wapas undo nahi hoga.`,
    )
    if (!isConfirmed) return

    setActionMessage('')
    try {
      const data = await deleteCompany(token, company.id)
      setActionMessage(data?.message || 'Company deleted.')
      await reloadCompanies()
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Company delete failed.')
    }
  }

  return (
    <section>
      <div className="pp-section-head">
        <h1 className="pp-page-title">Admin Companies</h1>
        <button type="button" className="pp-link-btn" onClick={openAddDialog}>
          Add Company
        </button>
      </div>

      <div className="pp-filter-row">
        <input
          className="pp-text-input"
          placeholder="Search by company name, website..."
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
      </div>

      {isLoading ? <p className="pp-info-line">Loading companies...</p> : null}
      {errorMessage ? <p className="pp-error-block">{errorMessage}</p> : null}
      {actionMessage ? <p className="pp-info-line">{actionMessage}</p> : null}

      <div className="pp-list">
        {filteredCompanies.map((company) => (
          <article className="pp-card" key={company.id}>
            <h2>{company.name || 'Company'}</h2>
            <p>{company.description || 'No description'}</p>
            <p>Location: {company.location || '-'}</p>
            <p>Website: {company.website || '-'}</p>
            <button
              type="button"
              className="pp-link-btn pp-link-btn-small"
              onClick={() => openEditDialog(company)}
            >
              Edit Company
            </button>
            <button
              type="button"
              className="pp-link-btn pp-link-btn-small pp-link-btn-danger"
              onClick={() => onDeleteClick(company)}
            >
              Delete Company
            </button>
          </article>
        ))}
      </div>

      {!isLoading && filteredCompanies.length === 0 ? (
        <p className="pp-info-line">No company found for selected filter.</p>
      ) : null}

      {isAddOpen ? (
        <CompanyFormDialog
          title={editCompanyId ? 'Edit Company' : 'Add Company'}
          formValues={formValues}
          isSaving={isSaving}
          onChange={onFormChange}
          onSave={onFormSave}
          onClose={closeDialog}
        />
      ) : null}
    </section>
  )
}

export default AdminCompaniesPage
