describe('API Tests for GET /customers', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('should fetch the first page of customers with default parameters', () => {
    cy.request(baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers').that.is.an('array');
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo.currentPage).to.eq(1);
    });
  });

  it('should fetch customers with specific size and industry filters', () => {
    cy.request(`${baseUrl}?size=Medium&industry=Technology`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.customers).to.be.an('array');
      response.body.customers.forEach(customer => {
        expect(customer.size).to.eq('Medium');
        expect(customer.industry).to.eq('Technology');
      });
    });
  });

  it('should paginate results correctly', () => {
    cy.request(`${baseUrl}?page=2&limit=10`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.pageInfo.currentPage).to.eq(2);
      expect(response.body.customers.length).to.be.at.most(10);
    });
  });

  it('should return 400 for invalid parameters', () => {
    cy.request({
      url: `${baseUrl}?page=-1&limit=abc&size=Invalid&industry=Unknown`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should validate size attribute based on employee count', () => {
    cy.request(baseUrl).then((response) => {
      response.body.customers.forEach(customer => {
        const employees = customer.employees;
        let expectedSize;
        if (employees < 100) expectedSize = 'Small';
        else if (employees < 1000) expectedSize = 'Medium';
        else if (employees < 10000) expectedSize = 'Enterprise';
        else if (employees < 50000) expectedSize = 'Large Enterprise';
        else expectedSize = 'Very Large Enterprise';
        expect(customer.size).to.eq(expectedSize);
      });
    });
  });

  it('should handle customers without contact info or address', () => {
    cy.request(baseUrl).then((response) => {
      response.body.customers.forEach(customer => {
        expect(customer).to.have.property('contactInfo');
        expect(customer).to.have.property('address');
      });
    });
  });
});
