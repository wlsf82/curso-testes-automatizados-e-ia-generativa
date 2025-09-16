/// <reference types="cypress" />

describe('GET /customers API tests', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('should return default pagination and all customers when no query params are sent', () => {
    cy.request(baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array').and.have.length.at.most(10);
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo.currentPage).to.eq(1);
    });
  });

  it('should return correct customers for page, limit, size, and industry filters', () => {
    cy.request({
      url: baseUrl,
      qs: {
        page: 2,
        limit: 10,
        size: 'Medium',
        industry: 'Technology'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.customers).to.be.an('array').and.have.length.at.most(10);

      // Check each customer matches filters
      response.body.customers.forEach((customer) => {
        expect(customer.size).to.eq('Medium');
        expect(customer.industry).to.eq('Technology');
        expect(customer.employees).to.be.gte(100).and.lt(1000);
      });

      expect(response.body.pageInfo.currentPage).to.eq(2);
    });
  });

  it('should correctly assign size based on employees', () => {
    // Small
    cy.request({
      url: baseUrl,
      qs: { size: 'Small', limit: 3 }
    }).then((response) => {
      response.body.customers.forEach((c) => {
        expect(c.size).to.eq('Small');
        expect(c.employees).to.be.lt(100);
      });
    });
    // Medium
    cy.request({
      url: baseUrl,
      qs: { size: 'Medium', limit: 3 }
    }).then((response) => {
      response.body.customers.forEach((c) => {
        expect(c.size).to.eq('Medium');
        expect(c.employees).to.be.gte(100).and.lt(1000);
      });
    });
    // Enterprise
    cy.request({
      url: baseUrl,
      qs: { size: 'Enterprise', limit: 3 }
    }).then((response) => {
      response.body.customers.forEach((c) => {
        expect(c.size).to.eq('Enterprise');
        expect(c.employees).to.be.gte(1000).and.lt(10000);
      });
    });
    // Large Enterprise
    cy.request({
      url: baseUrl,
      qs: { size: 'Large Enterprise', limit: 3 }
    }).then((response) => {
      response.body.customers.forEach((c) => {
        expect(c.size).to.eq('Large Enterprise');
        expect(c.employees).to.be.gte(10000).and.lt(50000);
      });
    });
    // Very Large Enterprise
    cy.request({
      url: baseUrl,
      qs: { size: 'Very Large Enterprise', limit: 3 }
    }).then((response) => {
      response.body.customers.forEach((c) => {
        expect(c.size).to.eq('Very Large Enterprise');
        expect(c.employees).to.be.gte(50000);
      });
    });
  });

  it('should allow filtering by industry', () => {
    const industries = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance'];

    industries.forEach(industry => {
      cy.request({
        url: baseUrl,
        qs: { industry, limit: 2 }
      }).then((response) => {
        response.body.customers.forEach((c) => {
          expect(c.industry).to.eq(industry);
        });
      });
    });
  });

  it('should have correct address and contactInfo fields', () => {
    cy.request({
      url: baseUrl,
      qs: { limit: 5 }
    }).then((response) => {
      response.body.customers.forEach((customer) => {
        expect(customer).to.have.property('address');
        expect(customer).to.have.property('contactInfo');
        // Address can be object or null
        if (customer.address) {
          expect(customer.address).to.have.all.keys(
            'street',
            'city',
            'state',
            'zipCode',
            'country'
          );
        }
        // contactInfo can be object or null
        if (customer.contactInfo) {
          expect(customer.contactInfo).to.have.all.keys(
            'name',
            'email'
          );
        }
      });
    });
  });

  it('should return 400 for invalid page or limit', () => {
    cy.request({
      url: baseUrl,
      qs: { page: -1 },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });

    cy.request({
      url: baseUrl,
      qs: { limit: 'abc' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should return 400 for unsupported size or industry', () => {
    cy.request({
      url: baseUrl,
      qs: { size: 'Tiny' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });

    cy.request({
      url: baseUrl,
      qs: { industry: 'Food' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should return pagination info in pageInfo property', () => {
    cy.request(baseUrl).then((response) => {
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo).to.have.all.keys(
        'currentPage',
        'totalPages',
        'totalCustomers'
      );
    });
  });
});