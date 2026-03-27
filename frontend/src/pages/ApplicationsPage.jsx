import { useSelector } from 'react-redux'
import useAppliedJobs from '../hooks/useAppliedJobs'

function ApplicationsPage() {
  const token = useSelector((state) => state.auth.token)
  const { appliedJobs, isLoading, errorMessage } = useAppliedJobs(token)

  return (
    <section>
      <h1 className="pp-page-title">My Applied Jobs</h1>

      {isLoading ? <p className="pp-info-line">Loading applied jobs...</p> : null}
      {errorMessage ? <p className="pp-error-block">{errorMessage}</p> : null}

      <div className="pp-list">
        {appliedJobs.map((item) => (
          <article className="pp-card" key={item.id}>
            <h2>{item.job?.title || 'Job'}</h2>
            <p>{item.job?.company?.name || 'Unknown Company'}</p>
            <p>{item.job?.location || '-'}</p>
            <span className={`pp-status pp-status-${(item.status || 'pending').toLowerCase()}`}>
              {(item.status || 'pending').toUpperCase()}
            </span>
          </article>
        ))}
      </div>

      {!isLoading && appliedJobs.length === 0 ? (
        <p className="pp-info-line">Aapne abhi tak kisi job par apply nahi kiya.</p>
      ) : null}
    </section>
  )
}

export default ApplicationsPage
