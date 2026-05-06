import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getApplicantsByJob, updateApplicantStatus } from '../services/jobApi'

function AdminApplicantsPage() {
  const { jobId } = useParams()
  const token = useSelector((state) => state.auth.token)

  const [applicants, setApplicants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  async function loadApplicants() {
    if (!token || !jobId) return

    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await getApplicantsByJob(jobId, token)
      const list = Array.isArray(data?.applicants) ? data.applicants : []
      setApplicants(list)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Applicants load nahi hue.')
      setApplicants([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadApplicants()
  }, [jobId, token])

  async function onStatusClick(applicationId, nextStatus) {
    setActionMessage('')
    try {
      const data = await updateApplicantStatus(applicationId, nextStatus, token)
      setActionMessage(data?.message || 'Status updated.')
      await loadApplicants()
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Status update failed.')
    }
  }

  function renderActions(application) {
    const status = (application.status || 'pending').toLowerCase()

    if (status === 'pending') {
      return (
        <div className="pp-action-row">
          <button
            type="button"
            className="pp-link-btn pp-link-btn-small"
            onClick={() => onStatusClick(application.id, 'shortlisted')}
          >
            Shortlist
          </button>
          <button
            type="button"
            className="pp-link-btn pp-link-btn-small pp-link-btn-danger"
            onClick={() => onStatusClick(application.id, 'rejected')}
          >
            Reject
          </button>
        </div>
      )
    }

    if (status === 'shortlisted') {
      return (
        <div className="pp-action-row">
          <button
            type="button"
            className="pp-link-btn pp-link-btn-small pp-link-btn-danger"
            onClick={() => onStatusClick(application.id, 'rejected')}
          >
            Move To Rejected
          </button>
        </div>
      )
    }

    return <p className="pp-info-line">No action available.</p>
  }

  return (
    <section>
      <div className="pp-section-head">
        <h1 className="pp-page-title">Applicants</h1>
        <Link className="pp-link-btn pp-link-btn-light" to="/admin/jobs">
          Back To Jobs
        </Link>
      </div>

      {isLoading ? <p className="pp-info-line">Loading applicants...</p> : null}
      {errorMessage ? <p className="pp-error-block">{errorMessage}</p> : null}
      {actionMessage ? <p className="pp-info-line">{actionMessage}</p> : null}

      <div className="pp-list">
        {applicants.map((application) => (
          <article className="pp-card" key={application.id}>
            <h2>{application.applicant?.fullName || 'Applicant'}</h2>
            <p>{application.applicant?.email || '-'}</p>
            <p>{application.applicant?.phoneNumber || '-'}</p>
            <span className={`pp-status pp-status-${(application.status || 'pending').toLowerCase()}`}>
              {(application.status || 'pending').toUpperCase()}
            </span>
            {renderActions(application)}
          </article>
        ))}
      </div>

      {!isLoading && applicants.length === 0 ? (
        <p className="pp-info-line">Is job par abhi koi applicant nahi hai.</p>
      ) : null}
    </section>
  )
}

export default AdminApplicantsPage
