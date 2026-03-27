import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  function goToBrowse() {
    navigate(`/browse?q=${encodeURIComponent(searchText)}&city=all&type=all`)
  }

  return (
    <>
      <section className="pp-hero">
        <p className="pp-badge">Public Job Portal</p>
        <h1>Find simple and best jobs in one place.</h1>
        <p>
          Search jobs by keyword, city, and job type. No complex steps.
        </p>
        <div className="pp-filter-row pp-filter-row-hero">
          <input
            className="pp-text-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search jobs like React, .NET, HR..."
          />
          <button type="button" className="pp-link-btn" onClick={goToBrowse}>
            Search Jobs
          </button>
        </div>
      </section>

      <section className="pp-grid">
        <article className="pp-card">
          <h2>Home Page</h2>
          <p>Main landing page with quick search box.</p>
        </article>
        <article className="pp-card">
          <h2>Jobs Page</h2>
          <p>All jobs in one list with search + filter.</p>
        </article>
        <article className="pp-card">
          <h2>Browse Page</h2>
          <p>Advanced search page with city and type filter.</p>
        </article>
      </section>
    </>
  )
}

export default HomePage
