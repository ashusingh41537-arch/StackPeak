import { useSelector } from 'react-redux'
import useAdminCompanies from '../hooks/useAdminCompanies'

function CompaniesPage() {
  const token = useSelector((state) => state.auth.token)
  const { companies, isLoading, errorMessage } = useAdminCompanies(token)

  return (
    <section>
      <h1 className="pp-page-title">Companies</h1>

      {isLoading && <p>Loading companies...</p>}
      {errorMessage && <p className="pp-error-block">{errorMessage}</p>}

      <div className="pp-list">
        {companies.map((company) => (
          <article className="pp-card" key={company.id}>
            <h2>{company.name}</h2>
            <p>{company.description || 'No description'}</p>
            <p>Location: {company.location || '-'}</p>
            <p>Website: {company.website || '-'}</p>
          </article>
        ))}
      </div>

      {!isLoading && companies.length === 0 && (
        <p>No companies found.</p>
      )}
    </section>
  )
}

export default CompaniesPage