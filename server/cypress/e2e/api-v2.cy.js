describe('API - GET /customers', () => {
  const apiUrl = Cypress.env('apiUrl')
  const endpoint = `${apiUrl}/customers`

  it('returns a 400 status for invalid size parameter', () => {
    const query = '?size=InvalidSize'
    cy.request({
      method: 'GET',
      url: `${endpoint}${query}`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('returns a 400 status for negative page number', () => {
    const query = '?page=-1'
    cy.request({
      method: 'GET',
      url: `${endpoint}${query}`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('returns a 400 status for non-numeric limit value', () => {
    const query = '?limit=abc'
    cy.request({
      method: 'GET',
      url: `${endpoint}${query}`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })
})
