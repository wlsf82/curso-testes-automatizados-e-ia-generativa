describe('GET /customers endpoint', () => {
  const apiUrl = Cypress.env('apiUrl')

  it('returns 200 and customers list when all parameters are valid', () => {
    cy.request('GET', `${apiUrl}/customers?page=2&limit=10&size=Medium&industry=Technology`)
      .then(({ status, body }) => {
        expect(status).to.eq(200)
        const { customers, pageInfo } = body

        expect(Array.isArray(customers)).to.be.true
        expect(pageInfo.currentPage).to.eq(2)
        expect(pageInfo.totalPages).to.be.greaterThan(0)
        expect(pageInfo.totalCustomers).to.be.greaterThan(0)
      })
  })

  it('returns 200 and filters by size=Small and industry=Retail', () => {
    cy.request('GET', `${apiUrl}/customers?size=Small&industry=Retail`)
      .then(({ status, body }) => {
        expect(status).to.eq(200)
        const { customers } = body

        customers.forEach(({ size, industry, employees }) => {
          expect(size).to.eq('Small')
          expect(industry).to.eq('Retail')
          expect(employees).to.be.lessThan(100)
        })
      })
  })

  it('returns 200 and filters by size=Enterprise and industry=Finance', () => {
    cy.request('GET', `${apiUrl}/customers?size=Enterprise&industry=Finance`)
      .then(({ status, body }) => {
        expect(status).to.eq(200)
        const { customers } = body

        customers.forEach(({ size, industry, employees }) => {
          expect(size).to.eq('Enterprise')
          expect(industry).to.eq('Finance')
          expect(employees).to.be.at.least(1000).and.to.be.below(10000)
        })
      })
  })

  it('returns 200 and supports default parameters', () => {
    cy.request('GET', `${apiUrl}/customers`)
      .then(({ status, body }) => {
        expect(status).to.eq(200)
        const { customers, pageInfo } = body

        expect(Array.isArray(customers)).to.be.true
        expect(pageInfo.currentPage).to.eq(1)
        expect(customers.length).to.be.at.most(10)
      })
  })

  it('returns 400 for negative page value', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?page=-1`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('returns 400 for non-numeric limit value', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?limit=abc`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('returns 400 for unsupported size value', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?size=Gigantic`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('returns 400 for unsupported industry value', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?industry=Automotive`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('returns 200 and null for missing contactInfo and address', () => {
    cy.request('GET', `${apiUrl}/customers?size=Medium&industry=Technology`)
      .then(({ status, body }) => {
        expect(status).to.eq(200)
        const { customers } = body

        customers.forEach(({ contactInfo, address }) => {
          if (!contactInfo) expect(contactInfo).to.be.null
          if (!address) expect(address).to.be.null
        })
      })
  })
})