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
  <article className="pp-home-card">
    <h2>🏠 Home</h2>
    <p>Quick job search with smart suggestions.</p>
    <button onClick={() => navigate('/')}>
      Go to Home
    </button>
  </article>

  <article className="pp-home-card">
    <h2>💼 All Jobs</h2>
    <p>Explore all available jobs with filters.</p>
    <button onClick={() => navigate('/jobs')}>
      View Jobs
    </button>
  </article>

  <article className="pp-home-card">
    <h2>🔍 Advanced Search</h2>
    <p>Filter jobs by city, type & keyword.</p>
    <button onClick={() => navigate('/browse')}>
      Browse Jobs
    </button>
  </article>
</section>
      
    </>
  )
}

export default HomePage
