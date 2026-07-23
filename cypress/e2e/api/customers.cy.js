const baseUrl = Cypress.env('API_URL')

describe('GET /customers', () => {
  context('Successful requests with default query strings', () => {
    it('returns status 200', () => {
      // Arrange
      const expectedStatus = 200

      // Act
      cy.request(`${baseUrl}/customers`)

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns customers array', () => {
      // Arrange
      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { customers } = body

        // Assert
        expect(customers).to.be.an('array')
        expect(customers.length).to.be.greaterThan(0)
      })
    })

    it('returns customers with correct structure', () => {
      // Arrange
      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { customers } = body
        const customer = customers[0]

        // Assert
        expect(customer).to.have.all.keys('id', 'name', 'employees', 'contactInfo', 'size', 'industry', 'address')
        expect(customer.id).to.be.a('number')
        expect(customer.name).to.be.a('string')
        expect(customer.employees).to.be.a('number')
        expect(customer.size).to.be.a('string')
        expect(customer.industry).to.be.a('string')
        expect(customer.address).to.be.oneOf([null, customer.address])
        expect(customer.contactInfo).to.be.oneOf([null, customer.contactInfo])
      })
    })

    it('returns address with correct structure when not null', () => {
      // Arrange
      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { customers } = body
        const customerWithAddress = customers.find(customer => customer.address !== null)

        // Assert
        expect(customerWithAddress.address).to.have.all.keys('street', 'city', 'state', 'zipCode', 'country')
        expect(customerWithAddress.address.street).to.be.a('string')
        expect(customerWithAddress.address.city).to.be.a('string')
        expect(customerWithAddress.address.state).to.be.a('string')
        expect(customerWithAddress.address.zipCode).to.be.a('string')
        expect(customerWithAddress.address.country).to.be.a('string')
      })
    })

    it('returns contactInfo with correct structure when not null', () => {
      // Arrange
      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { customers } = body
        const customerWithContactInfo = customers.find(customer => customer.contactInfo !== null)

        // Assert
        expect(customerWithContactInfo.contactInfo).to.have.all.keys('name', 'email')
        expect(customerWithContactInfo.contactInfo.name).to.be.a('string')
        expect(customerWithContactInfo.contactInfo.email).to.be.a('string')
      })
    })

    it('returns pageInfo with correct structure', () => {
      // Arrange
      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { pageInfo } = body

        // Assert
        expect(pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')
        expect(pageInfo.currentPage).to.be.a('number')
        expect(pageInfo.totalPages).to.be.a('number')
        expect(pageInfo.totalCustomers).to.be.a('number')
      })
    })

    it('returns current page as 1', () => {
      // Arrange
      const expectedPage = 1

      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { pageInfo: { currentPage } } = body

        // Assert
        expect(currentPage).to.equal(expectedPage)
      })
    })

    it('returns 10 customers by default', () => {
      // Arrange
      const expectedLimit = 10

      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { customers } = body

        // Assert
        expect(customers.length).to.equal(expectedLimit)
      })
    })

    it('returns correct size based on number of employees', () => {
      // Arrange
      // Act
      cy.request(`${baseUrl}/customers`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          if (customer.employees < 100) {
            expect(customer.size).to.equal('Small')
          } else if (customer.employees >= 100 && customer.employees < 1000) {
            expect(customer.size).to.equal('Medium')
          } else if (customer.employees >= 1000 && customer.employees < 10000) {
            expect(customer.size).to.equal('Enterprise')
          } else if (customer.employees >= 10000 && customer.employees < 50000) {
            expect(customer.size).to.equal('Large Enterprise')
          } else if (customer.employees >= 50000) {
            expect(customer.size).to.equal('Very Large Enterprise')
          }
        })
      })
    })
  })

  context('Successful requests with page parameter', () => {
    it('returns status 200 when page is valid', () => {
      // Arrange
      const expectedStatus = 200
      const page = 2

      // Act
      cy.request(`${baseUrl}/customers?page=${page}`)

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns correct page number in response', () => {
      // Arrange
      const page = 2

      // Act
      cy.request(`${baseUrl}/customers?page=${page}`).then(({ body }) => {
        const { pageInfo: { currentPage } } = body

        // Assert
        expect(currentPage).to.equal(page)
      })
    })

    it('returns different customers on different pages', () => {
      // Arrange
      // Act
      cy.request(`${baseUrl}/customers?page=1`).then(({ body: body1 }) => {
        const { customers: customers1 } = body1

        cy.request(`${baseUrl}/customers?page=2`).then(({ body: body2 }) => {
          const { customers: customers2 } = body2

          // Assert
          expect(customers1[0].id).to.not.equal(customers2[0].id)
        })
      })
    })
  })

  context('Successful requests with limit parameter', () => {
    it('returns status 200 when limit is valid', () => {
      // Arrange
      const expectedStatus = 200
      const limit = 5

      // Act
      cy.request(`${baseUrl}/customers?limit=${limit}`)

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns correct number of customers based on limit', () => {
      // Arrange
      const limit = 5

      // Act
      cy.request(`${baseUrl}/customers?limit=${limit}`).then(({ body }) => {
        const { customers } = body

        // Assert
        expect(customers.length).to.equal(limit)
      })
    })
  })

  context('Successful requests with size filter', () => {
    it('returns status 200 when size is valid', () => {
      // Arrange
      const expectedStatus = 200
      const size = 'Medium'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}`)

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns only Small customers when size filter is Small', () => {
      // Arrange
      const size = 'Small'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.size).to.equal('Small')
          expect(customer.employees).to.be.lessThan(100)
        })
      })
    })

    it('returns only Medium customers when size filter is Medium', () => {
      // Arrange
      const size = 'Medium'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.size).to.equal('Medium')
          expect(customer.employees).to.be.greaterThanOrEqual(100)
          expect(customer.employees).to.be.lessThan(1000)
        })
      })
    })

    it('returns only Enterprise customers when size filter is Enterprise', () => {
      // Arrange
      const size = 'Enterprise'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.size).to.equal('Enterprise')
          expect(customer.employees).to.be.greaterThanOrEqual(1000)
          expect(customer.employees).to.be.lessThan(10000)
        })
      })
    })

    it('returns only Large Enterprise customers when size filter is Large Enterprise', () => {
      // Arrange
      const size = 'Large Enterprise'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.size).to.equal('Large Enterprise')
          expect(customer.employees).to.be.greaterThanOrEqual(10000)
          expect(customer.employees).to.be.lessThan(50000)
        })
      })
    })

    it('returns only Very Large Enterprise customers when size filter is Very Large Enterprise', () => {
      // Arrange
      const size = 'Very Large Enterprise'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.size).to.equal('Very Large Enterprise')
          expect(customer.employees).to.be.greaterThanOrEqual(50000)
        })
      })
    })
  })

  context('Successful requests with industry filter', () => {
    it('returns status 200 when industry is valid', () => {
      // Arrange
      const expectedStatus = 200
      const industry = 'Technology'

      // Act
      cy.request(`${baseUrl}/customers?industry=${industry}`)

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns only Logistics customers when industry filter is Logistics', () => {
      // Arrange
      const industry = 'Logistics'

      // Act
      cy.request(`${baseUrl}/customers?industry=${industry}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.industry).to.equal('Logistics')
        })
      })
    })

    it('returns only Retail customers when industry filter is Retail', () => {
      // Arrange
      const industry = 'Retail'

      // Act
      cy.request(`${baseUrl}/customers?industry=${industry}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.industry).to.equal('Retail')
        })
      })
    })

    it('returns only Technology customers when industry filter is Technology', () => {
      // Arrange
      const industry = 'Technology'

      // Act
      cy.request(`${baseUrl}/customers?industry=${industry}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.industry).to.equal('Technology')
        })
      })
    })

    it('returns only HR customers when industry filter is HR', () => {
      // Arrange
      const industry = 'HR'

      // Act
      cy.request(`${baseUrl}/customers?industry=${industry}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.industry).to.equal('HR')
        })
      })
    })

    it('returns only Finance customers when industry filter is Finance', () => {
      // Arrange
      const industry = 'Finance'

      // Act
      cy.request(`${baseUrl}/customers?industry=${industry}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.industry).to.equal('Finance')
        })
      })
    })
  })

  context('Failed requests with invalid page parameter', () => {
    it('returns status 400 when page is 0', () => {
      // Arrange
      const expectedStatus = 400
      const page = 0

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?page=${page}`,
        failOnStatusCode: false
      })

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns status 400 when page is -1', () => {
      // Arrange
      const expectedStatus = 400
      const page = -1

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?page=${page}`,
        failOnStatusCode: false
      })

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns error message when page is invalid', () => {
      // Arrange
      const page = 0

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?page=${page}`,
        failOnStatusCode: false
      }).then(({ body }) => {
        const { error } = body

        // Assert
        expect(error).to.be.a('string')
        expect(error).to.include('Invalid page or limit')
      })
    })
  })

  context('Failed requests with invalid limit parameter', () => {
    it('returns status 400 when limit is 0', () => {
      // Arrange
      const expectedStatus = 400
      const limit = 0

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?limit=${limit}`,
        failOnStatusCode: false
      })

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns status 400 when limit is -1', () => {
      // Arrange
      const expectedStatus = 400
      const limit = -1

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?limit=${limit}`,
        failOnStatusCode: false
      })

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns error message when limit is invalid', () => {
      // Arrange
      const limit = 0

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?limit=${limit}`,
        failOnStatusCode: false
      }).then(({ body }) => {
        const { error } = body

        // Assert
        expect(error).to.be.a('string')
        expect(error).to.include('Invalid page or limit')
      })
    })
  })

  context('Failed requests with invalid size parameter', () => {
    it('returns status 400 when size is unsupported', () => {
      // Arrange
      const expectedStatus = 400
      const size = 'InvalidSize'

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?size=${size}`,
        failOnStatusCode: false
      })

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns error message when size is unsupported', () => {
      // Arrange
      const size = 'InvalidSize'

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?size=${size}`,
        failOnStatusCode: false
      }).then(({ body }) => {
        const { error } = body

        // Assert
        expect(error).to.be.a('string')
        expect(error).to.include('Unsupported size value')
      })
    })
  })

  context('Failed requests with invalid industry parameter', () => {
    it('returns status 400 when industry is unsupported', () => {
      // Arrange
      const expectedStatus = 400
      const industry = 'InvalidIndustry'

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?industry=${industry}`,
        failOnStatusCode: false
      })

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns error message when industry is unsupported', () => {
      // Arrange
      const industry = 'InvalidIndustry'

      // Act
      cy.request({
        method: 'GET',
        url: `${baseUrl}/customers?industry=${industry}`,
        failOnStatusCode: false
      }).then(({ body }) => {
        const { error } = body

        // Assert
        expect(error).to.be.a('string')
        expect(error).to.include('Unsupported industry value')
      })
    })
  })

  context('Successful requests with combined filters', () => {
    it('returns status 200 when size and industry filters are combined', () => {
      // Arrange
      const expectedStatus = 200
      const size = 'Medium'
      const industry = 'Technology'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}&industry=${industry}`)

      // Assert
        .should((response) => {
          expect(response.status).to.equal(expectedStatus)
        })
    })

    it('returns only Medium Technology customers when both filters are applied', () => {
      // Arrange
      const size = 'Medium'
      const industry = 'Technology'

      // Act
      cy.request(`${baseUrl}/customers?size=${size}&industry=${industry}&limit=100`).then(({ body }) => {
        const { customers } = body

        // Assert
        customers.forEach(customer => {
          expect(customer.size).to.equal('Medium')
          expect(customer.industry).to.equal('Technology')
          expect(customer.employees).to.be.greaterThanOrEqual(100)
          expect(customer.employees).to.be.lessThan(1000)
        })
      })
    })
  })
})
