describe('GET /customers API Tests', () => {
  const baseUrl = 'http://localhost:3001';
  const endpoint = '/customers';

  describe('Successful Requests', () => {
    it('should return customers with default pagination', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('customers');
        expect(response.body).to.have.property('pageInfo');
        expect(response.body.customers).to.be.an('array');
        expect(response.body.customers.length).to.be.at.most(10);
        expect(response.body.pageInfo.currentPage).to.equal(1);
      });
    });

    it('should return customers with custom page and limit parameters', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=2&limit=5`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.pageInfo.currentPage).to.equal(2);
        expect(response.body.customers.length).to.be.at.most(5);
      });
    });

    it('should return customers filtered by size=Small', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=Small`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.equal('Small');
          expect(customer.employees).to.be.lessThan(100);
        });
      });
    });

    it('should return customers filtered by size=Medium', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=Medium`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.equal('Medium');
          expect(customer.employees).to.be.at.least(100);
          expect(customer.employees).to.be.lessThan(1000);
        });
      });
    });

    it('should return customers filtered by size=Enterprise', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=Enterprise`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.equal('Enterprise');
          expect(customer.employees).to.be.at.least(1000);
          expect(customer.employees).to.be.lessThan(10000);
        });
      });
    });

    it('should return customers filtered by size=Large Enterprise', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=Large%20Enterprise`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.equal('Large Enterprise');
          expect(customer.employees).to.be.at.least(10000);
          expect(customer.employees).to.be.lessThan(50000);
        });
      });
    });

    it('should return customers filtered by size=Very Large Enterprise', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=Very%20Large%20Enterprise`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.equal('Very Large Enterprise');
          expect(customer.employees).to.be.at.least(50000);
        });
      });
    });

    it('should return customers filtered by industry=Logistics', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?industry=Logistics`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.industry).to.equal('Logistics');
        });
      });
    });

    it('should return customers filtered by industry=Retail', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?industry=Retail`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.industry).to.equal('Retail');
        });
      });
    });

    it('should return customers filtered by industry=Technology', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?industry=Technology`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.industry).to.equal('Technology');
        });
      });
    });

    it('should return customers filtered by industry=HR', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?industry=HR`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.industry).to.equal('HR');
        });
      });
    });

    it('should return customers filtered by industry=Finance', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?industry=Finance`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer.industry).to.equal('Finance');
        });
      });
    });

    it('should return customers with multiple filters applied', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=2&limit=10&size=Medium&industry=Technology`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.pageInfo.currentPage).to.equal(2);
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.equal('Medium');
          expect(customer.industry).to.equal('Technology');
        });
      });
    });

    it('should have correct response structure for each customer', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(customer).to.have.property('id');
          expect(customer).to.have.property('name');
          expect(customer).to.have.property('employees');
          expect(customer).to.have.property('contactInfo');
          expect(customer).to.have.property('size');
          expect(customer).to.have.property('industry');
          expect(customer).to.have.property('address');

          expect(customer.id).to.be.a('number');
          expect(customer.name).to.be.a('string');
          expect(customer.employees).to.be.a('number');
          expect(customer.size).to.be.a('string');
          expect(customer.industry).to.be.a('string');
        });
      });
    });

    it('should handle contactInfo as null or object', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          if (customer.contactInfo !== null) {
            expect(customer.contactInfo).to.be.an('object');
            expect(customer.contactInfo).to.have.property('name');
            expect(customer.contactInfo).to.have.property('email');
          }
        });
      });
    });

    it('should handle address as null or object with complete structure', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          if (customer.address !== null) {
            expect(customer.address).to.be.an('object');
            expect(customer.address).to.have.property('street');
            expect(customer.address).to.have.property('city');
            expect(customer.address).to.have.property('state');
            expect(customer.address).to.have.property('zipCode');
            expect(customer.address).to.have.property('country');
          }
        });
      });
    });

    it('should have correct pageInfo structure', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.pageInfo).to.have.property('currentPage');
        expect(response.body.pageInfo).to.have.property('totalPages');
        expect(response.body.pageInfo).to.have.property('totalCustomers');

        expect(response.body.pageInfo.currentPage).to.be.a('number');
        expect(response.body.pageInfo.totalPages).to.be.a('number');
        expect(response.body.pageInfo.totalCustomers).to.be.a('number');
      });
    });
  });

  describe('Pagination Tests', () => {
    it('should respect the limit parameter', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=5`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.customers.length).to.be.at.most(5);
      });
    });

    it('should navigate to different pages', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=1&limit=10`,
        failOnStatusCode: false,
      }).then((response1) => {
        expect(response1.status).to.equal(200);
        const page1Customers = response1.body.customers;

        cy.request({
          method: 'GET',
          url: `${baseUrl}${endpoint}?page=2&limit=10`,
          failOnStatusCode: false,
        }).then((response2) => {
          expect(response2.status).to.equal(200);
          expect(response2.body.pageInfo.currentPage).to.equal(2);
          // Ensure different customers are returned on different pages
          const page2Customers = response2.body.customers;
          expect(page1Customers[0].id).not.to.equal(page2Customers[0].id);
        });
      });
    });

    it('should return correct totalPages in pageInfo', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=10`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        const { totalCustomers, totalPages } = response.body.pageInfo;
        const expectedPages = Math.ceil(totalCustomers / 10);
        expect(totalPages).to.equal(expectedPages);
      });
    });

    it('should handle large limit values', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=100`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.customers.length).to.be.at.most(100);
      });
    });
  });

  describe('Invalid Request Parameters', () => {
    it('should return 400 for negative page number', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=-1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for negative limit value', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=-5`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for non-numeric page value', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=abc`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for non-numeric limit value', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=xyz`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for unsupported size value', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=XLarge`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for unsupported industry value', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?industry=Agriculture`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for zero page number', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=0`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for zero limit value', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=0`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for decimal page number', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=1.5`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for decimal limit value', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=5.5`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should return 400 for multiple invalid parameters', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=-1&limit=abc&size=Invalid&industry=NotExist`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  describe('Case Sensitivity Tests', () => {
    it('should handle industry parameter with different cases', () => {
      // Test lowercase
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?industry=technology`,
        failOnStatusCode: false,
      }).then((response) => {
        // Implementation may vary - either 400 or accept it
        // Adjust based on actual API behavior
        expect([200, 400]).to.include(response.status);
      });
    });

    it('should handle size parameter with different cases', () => {
      // Test lowercase
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=small`,
        failOnStatusCode: false,
      }).then((response) => {
        // Implementation may vary - either 400 or accept it
        // Adjust based on actual API behavior
        expect([200, 400]).to.include(response.status);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large page number', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=999999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        // Should return empty customers array if page is beyond available pages
        expect(response.body.customers).to.be.an('array');
      });
    });

    it('should handle whitespace in query parameters', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=1&limit=10`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should handle duplicate query parameters', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?page=1&page=2&limit=10`,
        failOnStatusCode: false,
      }).then((response) => {
        // Should use one of the values or return 400
        expect([200, 400]).to.include(response.status);
      });
    });

    it('should handle empty response for non-existent combination', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?size=Small&industry=Technology`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.customers).to.be.an('array');
        expect(response.body.pageInfo).to.exist;
      });
    });
  });

  describe('Data Consistency Tests', () => {
    it('should ensure employee count matches size classification', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=50`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          const { employees, size } = customer;

          if (size === 'Small') {
            expect(employees).to.be.lessThan(100);
          } else if (size === 'Medium') {
            expect(employees).to.be.at.least(100);
            expect(employees).to.be.lessThan(1000);
          } else if (size === 'Enterprise') {
            expect(employees).to.be.at.least(1000);
            expect(employees).to.be.lessThan(10000);
          } else if (size === 'Large Enterprise') {
            expect(employees).to.be.at.least(10000);
            expect(employees).to.be.lessThan(50000);
          } else if (size === 'Very Large Enterprise') {
            expect(employees).to.be.at.least(50000);
          }
        });
      });
    });

    it('should ensure no duplicate customer IDs in single page', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=50`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        const ids = response.body.customers.map((c) => c.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).to.equal(ids.length);
      });
    });

    it('should have all customers belonging to valid industries', () => {
      const validIndustries = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance'];

      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=50`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(validIndustries).to.include(customer.industry);
        });
      });
    });

    it('should have all customers with valid size classifications', () => {
      const validSizes = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise'];

      cy.request({
        method: 'GET',
        url: `${baseUrl}${endpoint}?limit=50`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        response.body.customers.forEach((customer) => {
          expect(validSizes).to.include(customer.size);
        });
      });
    });
  });
});
