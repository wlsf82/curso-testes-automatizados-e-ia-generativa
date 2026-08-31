describe('GET /customers', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('Deve retornar clientes utilizando os parâmetros padrão', () => {
    cy.request('GET', baseUrl).then((response) => {

      expect(response.status).to.eq(200);

      expect(response.body).to.have.property('customers');
      expect(response.body).to.have.property('pageInfo');

      expect(response.body.customers).to.be.an('array');

      expect(response.body.pageInfo.currentPage).to.eq(1);
      expect(response.body.pageInfo).to.have.property('totalPages');
      expect(response.body.pageInfo).to.have.property('totalCustomers');

      expect(response.body.customers.length).to.be.lte(10);
    });
  });

  it('Deve retornar clientes conforme paginação informada', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        page: 2,
        limit: 5
      }
    }).then((response) => {

      expect(response.status).to.eq(200);

      expect(response.body.pageInfo.currentPage).to.eq(2);
      expect(response.body.customers.length).to.be.lte(5);
    });
  });

  it('Deve filtrar clientes por tamanho', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        size: 'Medium'
      }
    }).then((response) => {

      expect(response.status).to.eq(200);

      response.body.customers.forEach(customer => {
        expect(customer.size).to.eq('Medium');
      });

    });

  });

  it('Deve filtrar clientes por indústria', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        industry: 'Technology'
      }
    }).then((response) => {

      expect(response.status).to.eq(200);

      response.body.customers.forEach(customer => {
        expect(customer.industry).to.eq('Technology');
      });

    });

  });

  it('Deve filtrar por tamanho e indústria simultaneamente', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        size: 'Medium',
        industry: 'Technology'
      }
    }).then((response) => {

      expect(response.status).to.eq(200);

      response.body.customers.forEach(customer => {
        expect(customer.size).to.eq('Medium');
        expect(customer.industry).to.eq('Technology');
      });

    });

  });

  it('Deve validar a estrutura dos clientes retornados', () => {

    cy.request(baseUrl).then((response) => {

      expect(response.status).to.eq(200);

      response.body.customers.forEach(customer => {

        expect(customer).to.have.all.keys(
          'id',
          'name',
          'employees',
          'contactInfo',
          'size',
          'industry',
          'address'
        );

        expect(customer.id).to.be.a('number');
        expect(customer.name).to.be.a('string');
        expect(customer.employees).to.be.a('number');

        if (customer.contactInfo !== null) {
          expect(customer.contactInfo).to.have.keys('name', 'email');
        }

        if (customer.address !== null) {
          expect(customer.address).to.have.keys(
            'street',
            'city',
            'state',
            'zipCode',
            'country'
          );
        }

      });

    });

  });

  it('Deve validar o cálculo do campo size baseado na quantidade de funcionários', () => {

    cy.request(baseUrl).then((response) => {

      response.body.customers.forEach(customer => {

        let expectedSize;

        if (customer.employees < 100) {
          expectedSize = 'Small';
        } else if (customer.employees < 1000) {
          expectedSize = 'Medium';
        } else if (customer.employees < 10000) {
          expectedSize = 'Enterprise';
        } else if (customer.employees < 50000) {
          expectedSize = 'Large Enterprise';
        } else {
          expectedSize = 'Very Large Enterprise';
        }

        expect(customer.size).to.eq(expectedSize);

      });

    });

  });

  it('Deve retornar 400 para página negativa', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      failOnStatusCode: false,
      qs: {
        page: -1
      }
    }).then((response) => {

      expect(response.status).to.eq(400);

    });

  });

  it('Deve retornar 400 para limit negativo', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      failOnStatusCode: false,
      qs: {
        limit: -5
      }
    }).then((response) => {

      expect(response.status).to.eq(400);

    });

  });

  it('Deve retornar 400 para página não numérica', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      failOnStatusCode: false,
      qs: {
        page: 'abc'
      }
    }).then((response) => {

      expect(response.status).to.eq(400);

    });

  });

  it('Deve retornar 400 para limit não numérico', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      failOnStatusCode: false,
      qs: {
        limit: 'xyz'
      }
    }).then((response) => {

      expect(response.status).to.eq(400);

    });

  });

  it('Deve retornar 400 para tamanho inválido', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      failOnStatusCode: false,
      qs: {
        size: 'Gigantic'
      }
    }).then((response) => {

      expect(response.status).to.eq(400);

    });

  });

  it('Deve retornar 400 para indústria inválida', () => {

    cy.request({
      method: 'GET',
      url: baseUrl,
      failOnStatusCode: false,
      qs: {
        industry: 'Education'
      }
    }).then((response) => {

      expect(response.status).to.eq(400);

    });

  });

});
