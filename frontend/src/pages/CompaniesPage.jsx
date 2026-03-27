const companies = [
  { name: 'StackPeak Labs', role: 'Product Engineering', city: 'Bangalore' },
  { name: 'Prime Systems', role: 'Data Platform', city: 'Hyderabad' },
  { name: 'NexaBridge', role: 'Cloud Services', city: 'Gurgaon' },
]

function CompaniesPage() {
  return (
    <section>
      <h1 className="pp-page-title">Companies</h1>
      <div className="pp-list">
        {companies.map((company) => (
          <article className="pp-card" key={company.name}>
            <h2>{company.name}</h2>
            <p>
              {company.role} - {company.city}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CompaniesPage
