import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useAllJobs from '../hooks/useAllJobs'

function BrowsePage() {
  const { allJobs, isLoading, errorMessage } = useAllJobs()
  const [params, setParams] = useSearchParams()
  const [searchText, setSearchText] = useState(params.get('q') || '')

  const cityValue = params.get('city') || 'all'
  const typeValue = params.get('type') || 'all'

  const cityList = useMemo(() => {
    const values = allJobs.map((job) => job.location).filter(Boolean)
    return ['all', ...new Set(values)]
  }, [allJobs])

  const typeList = useMemo(() => {
    const values = allJobs.map((job) => job.jobType).filter(Boolean)
    return ['all', ...new Set(values)]
  }, [allJobs])

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const text = `${job.title || ''} ${job.description || ''} ${job.company?.name || ''}`.toLowerCase()
      const matchesSearch = text.includes(searchText.toLowerCase())
      const matchesCity = cityValue === 'all' || job.location === cityValue
      const matchesType = typeValue === 'all' || job.jobType === typeValue
      return matchesSearch && matchesCity && matchesType
    })
  }, [allJobs, searchText, cityValue, typeValue])

  function updateFilter(key, value) {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next)
  }

  function runSearch() {
    updateFilter('q', searchText)
  }

  return (
    <section>
      <h1 className="pp-page-title">Browse Jobs</h1>

      <div className="pp-filter-row">
        <input
          className="pp-text-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Type keyword and click search"
        />
        <button type="button" className="pp-link-btn" onClick={runSearch}>
          Search
        </button>
      </div>

      <div className="pp-filter-row">
        <select
          className="pp-select-input"
          value={cityValue}
          onChange={(e) => updateFilter('city', e.target.value)}
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
          onChange={(e) => updateFilter('type', e.target.value)}
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
        <p className="pp-info-line">No matching job found.</p>
      ) : null}
    </section>
  )
}

export default BrowsePage
