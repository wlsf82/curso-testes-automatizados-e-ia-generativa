describe('Meal Suggestion App', () => {
  beforeEach(() => {
    cy.visit('https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html');
  });

  it('Deve carregar a página corretamente e exibir os elementos principais', () => {
    cy.get('h1').should('contain', 'Refeição vegana').should('be.visible');
    cy.get('#meal-type-filter').should('be.visible');
    cy.get('#search-field').should('be.visible').and('have.attr', 'placeholder', 'Ex: Arroz e feijão');
    cy.get('button').contains('Buscar').should('be.visible');
    cy.get('#meal-name').should('be.visible');
    cy.get('#ingredients-list').should('be.visible');
  });

  it('Deve gerar uma sugestão de refeição ao carregar a página', () => {
    cy.get('#meal-name').invoke('text').should('not.be.empty');
    cy.get('#ingredients-list li').should('have.length.greaterThan', 0);
  });

  it('Deve permitir alterar o tipo de refeição e exibir pratos adequados', () => {
    cy.get('#meal-type-filter').select('Saladas');
    cy.get('#meal-name').invoke('text').should('match', /salada/i);
  });

  it('Deve permitir buscar um prato específico e exibir seus ingredientes corretamente', () => {
    cy.get('#search-field').type('Feijoada');
    cy.get('button').contains('Buscar').click();

    cy.get('#meal-name').should('contain', 'Feijoada');
    cy.get('#ingredients-list li').then(ingredients => {
      const expectedIngredients = ['feijão vermelho', 'abobrinha', 'cenoura', 'cebola', 'alho', 'couve', 'laranja'];
      ingredients.each((index, item) => {
        cy.wrap(item).should('contain', expectedIngredients[index]);
      });
    });
  });

  it('Deve exibir mensagem ou não atualizar quando a busca não retorna resultados', () => {
    cy.get('#meal-name').invoke('text').then(mealName => {
      cy.get('#search-field').type('Prato inexistente');
      cy.get('button').contains('Buscar').click();
      cy.get('#meal-name').should('have.text', mealName);
    })
  });
});
