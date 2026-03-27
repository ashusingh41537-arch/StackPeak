import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useAllJobs from '../hooks/useAllJobs'

function JobsPage() {
  const { allJobs, isLoading, errorMessage } = useAllJobs()
  const [searchText, setSearchText] = useState('')
  const [cityValue, setCityValue] = useState('all')
  const [typeValue, setTypeValue] = useState('all')

  const cityList = useMemo(() => {
    const uniqueValues = allJobs.map((job) => job.location).filter(Boolean)
    return ['all', ...new Set(uniqueValues)]
  }, [allJobs])

  const typeList = useMemo(() => {
    const uniqueValues = allJobs.map((job) => job.jobType).filter(Boolean)
    return ['all', ...new Set(uniqueValues)]
  }, [allJobs])

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const title = job.title || ''
      const description = job.description || ''
      const companyName = job.company?.name || ''

      const matchesSearch =
        title.toLowerCase().includes(searchText.toLowerCase()) ||
        description.toLowerCase().includes(searchText.toLowerCase()) ||
        companyName.toLowerCase().includes(searchText.toLowerCase())

      const matchesCity = cityValue === 'all' || job.location === cityValue
      const matchesType = typeValue === 'all' || job.jobType === typeValue

      return matchesSearch && matchesCity && matchesType
    })
  }, [allJobs, searchText, cityValue, typeValue])

  return (
    <section>
      <div className="pp-section-head">
        <h1 className="pp-page-title">Jobs</h1>
        <Link className="pp-link-btn" to="/browse">
          Open Browse Page
        </Link>
      </div>

      <div className="pp-filter-row">
        <input
          className="pp-text-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by job, company, skill..."
        />

        <select
          className="pp-select-input"
          value={cityValue}
          onChange={(e) => setCityValue(e.target.value)}
        >
          {cityList.map((city) => (
            <option key={city} value={city}>
              {city === 'all' ? 'All Cities' : city}
            </option>
          ))}
        </select>

        <select
          className="pp-select-input"
          value={typeValue}
          onChange={(e) => setTypeValue(e.target.value)}
        >
          {typeList.map((type) => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <p className="pp-info-line">Loading jobs...</p> : null}
      {errorMessage ? <p className="pp-error-block">{errorMessage}</p> : null}

      <div className="pp-list">
        {filteredJobs.map((job) => (
          <article className="pp-card" key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.company?.name || 'Unknown Company'}</p>
            <p>
              {job.location} - {job.jobType}
            </p>
            <Link className="pp-link-btn pp-link-btn-small" to={`/jobs/${job.id}`}>
              View Details
            </Link>
          </article>
        ))}
      </div>

      {!isLoading && filteredJobs.length === 0 ? (
        <p className="pp-info-line">No jobs found for selected filters.</p>
      ) : null}
    </section>
  )
}

export default JobsPage
