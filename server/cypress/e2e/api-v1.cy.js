describe('API Tests for /customers endpoint', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('should return the default first page with ten customers when no parameters are provided', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers').and.to.be.an('array').and.to.have.length(10);
      expect(response.body.pageInfo).to.have.property('currentPage', 1);
    });
  });

  it('should return a 400 error for invalid query parameters', () => {
    const invalidQueries = [
      '?page=-1',
      '?limit=-10',
      '?size=InvalidSize',
      '?industry=InvalidIndustry',
    ];

    invalidQueries.forEach((query) => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${query}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  it('should filter customers by size', () => {
    const sizes = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise'];
    sizes.forEach((size) => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}?size=${size}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        response.body.customers.forEach((customer) => {
          expect(customer).to.have.property('size', size);
        });
      });
    });
  });

  it('should filter customers by industry', () => {
    const industries = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance'];
    industries.forEach((industry) => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}?industry=${industry}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        response.body.customers.forEach((customer) => {
          expect(customer).to.have.property('industry', industry);
        });
      });
    });
  });

  it('should handle customers with null contactInfo and address', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
    }).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        if (!customer.contactInfo) {
          expect(customer).to.have.property('contactInfo', null);
        }
        if (!customer.address) {
          expect(customer).to.have.property('address', null);
        }
      });
    });
  });
});
