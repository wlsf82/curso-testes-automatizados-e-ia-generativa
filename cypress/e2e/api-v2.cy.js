describe('GET /customers', () => {
  const apiUrl = Cypress.env('apiUrl')

  it('Retorna a primeira página com valores padrão', () => {
    cy.request('GET', `${apiUrl}/customers`)
      .then(({ status, body }) => {
        const { customers, pageInfo } = body
        const { currentPage } = pageInfo

        expect(status).to.eq(200)
        expect(currentPage).to.eq(1)
        expect(customers).to.have.length.at.most(10)
      })
  })

  it('Filtra clientes pelo porte', () => {
    cy.request('GET', `${apiUrl}/customers?size=Enterprise`)
      .then(({ status, body }) => {
        const { customers } = body

        expect(status).to.eq(200)

        customers.forEach(({ size }) => {
          expect(size).to.eq('Enterprise')
        })
      })
  })

  it('Filtra clientes pelo segmento', () => {
    cy.request('GET', `${apiUrl}/customers?industry=Finance`)
      .then(({ status, body }) => {
        const { customers } = body

        expect(status).to.eq(200)

        customers.forEach(({ industry }) => {
          expect(industry).to.eq('Finance')
        })
      })
  })

  it('Retorna erro para página negativa', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?page=-1`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('Retorna erro para limite inválido', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?limit=abc`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('Retorna erro para porte inválido', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?size=Invalid`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('Retorna erro para segmento inválido', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/customers?industry=Invalid`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })
})

