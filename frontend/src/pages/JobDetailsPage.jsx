import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { applyJob, getJobById } from '../services/jobApi'

function JobDetailsPage() {
  const { jobId } = useParams()
  const token = useSelector((state) => state.auth.token)
  const navigate = useNavigate()
  const location = useLocation()

  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isApplyLoading, setIsApplyLoading] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadJob() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const data = await getJobById(jobId)
        if (isMounted) {
          setJob(data?.job || null)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error?.response?.data?.message || 'Job details load nahi hue.')
          setJob(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (jobId) {
      loadJob()
    }

    return () => {
      isMounted = false
    }
  }, [jobId])

  async function onApplyClick() {
    setApplyMessage('')

    if (!token) {
      navigate('/login', { state: { from: location } })
      return
    }

    setIsApplyLoading(true)
    try {
      const data = await applyJob(jobId, token)
      setApplyMessage(data?.message || 'Applied successfully.')
    } catch (error) {
      setApplyMessage(error?.response?.data?.message || 'Apply failed.')
    } finally {
      setIsApplyLoading(false)
    }
  }

  if (isLoading) {
    return <p className="pp-info-line">Loading job details...</p>
  }

  if (errorMessage) {
    return <p className="pp-error-block">{errorMessage}</p>
  }

  if (!job) {
    return <p className="pp-info-line">Job not found.</p>
  }

  return (
    <section className="pp-job-details">
      <h1 className="pp-page-title">{job.title}</h1>
      <p className="pp-detail-line">Company: {job.company?.name || 'Unknown Company'}</p>
      <p className="pp-detail-line">Location: {job.location}</p>
      <p className="pp-detail-line">Type: {job.jobType}</p>
      <p className="pp-detail-line">Salary: {job.salary}</p>
      <p className="pp-detail-line">Experience: {job.experienceLevel} years</p>

      <h2 className="pp-sub-title">Description</h2>
      <p>{job.description}</p>

      <h2 className="pp-sub-title">Requirements</h2>
      <ul className="pp-simple-list">
        {(job.requirements || []).map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>

      <div className="pp-action-row">
        <button type="button" className="pp-link-btn" onClick={onApplyClick} disabled={isApplyLoading}>
          {isApplyLoading ? 'Applying...' : 'Apply Job'}
        </button>
        <Link className="pp-link-btn pp-link-btn-light" to="/applications">
          My Applied Jobs
        </Link>
      </div>

      {applyMessage ? <p className="pp-info-line">{applyMessage}</p> : null}
    </section>
  )
}

export default JobDetailsPage
