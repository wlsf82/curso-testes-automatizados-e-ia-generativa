describe('API Tests for /customers endpoint', () => {
  const baseUrl = Cypress.env('apiUrl')

  context('Successful requests', () => {
    it('retrieves customers with default query parameters', () => {
      // Arrange
      const expectedStatus = 200

      // Act
      cy.request(`${baseUrl}/customers`).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        const { customers, pageInfo } = response.body
        expect(customers).to.be.an('array')
        expect(pageInfo).to.be.an('object')
        customers.forEach(customer => {
          expect(customer).to.have.all.keys(
            'id',
            'name',
            'employees',
            'contactInfo',
            'size',
            'industry',
            'address'
          )
        })
      })
    })

    it('retrieves customers with size filter', () => {
      // Arrange
      const expectedStatus = 200
      const size = 'Medium'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}`).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        const { customers } = response.body
        customers.forEach(customer => {
          expect(customer.size).to.eq(size)
          expect(customer.employees).to.be.gte(100).and.lt(1000)
        })
      })
    })

    it('retrieves customers with industry filter', () => {
      // Arrange
      const expectedStatus = 200
      const industry = 'Technology'

      // Act
      cy.request(`${baseUrl}/customers?industry=${industry}`).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        const { customers } = response.body
        customers.forEach(customer => {
          expect(customer.industry).to.eq(industry)
        })
      })
    })

    it('retrieves customers with pagination', () => {
      // Arrange
      const expectedStatus = 200
      const page = 2
      const limit = 5

      // Act
      cy.request(`${baseUrl}/customers?page=${page}&limit=${limit}`).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        const { customers, pageInfo } = response.body
        expect(pageInfo.currentPage).to.eq(page)
        expect(customers).to.have.length.of.at.most(limit)
      })
    })
  })

  context('Error scenarios', () => {
    it('returns 400 for invalid page parameter (negative)', () => {
      // Arrange
      const expectedStatus = 400
      const page = -1

      // Act
      cy.request({
        url: `${baseUrl}/customers?page=${page}`,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('returns 400 for invalid limit parameter (zero)', () => {
      // Arrange
      const expectedStatus = 400
      const limit = 0

      // Act
      cy.request({
        url: `${baseUrl}/customers?limit=${limit}`,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('returns 400 for unsupported size value', () => {
      // Arrange
      const expectedStatus = 400
      const size = 'Gigantic'

      // Act
      cy.request({
        url: `${baseUrl}/customers?size=${size}`,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        expect(response.body.error).to.eq('Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.')
      })
    })

    it('returns 400 for unsupported industry value', () => {
      // Arrange
      const expectedStatus = 400
      const industry = 'Agriculture'

      // Act
      cy.request({
        url: `${baseUrl}/customers?industry=${industry}`,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(expectedStatus)
        expect(response.body.error).to.eq('Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.')
      })
    })
  })
})
