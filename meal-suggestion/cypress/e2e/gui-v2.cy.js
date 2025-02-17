describe('Meal Suggestion App', () => {
  beforeEach(() => {
    cy.visit('https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html');
  });

  it('Deve carregar a página e exibir os elementos principais', () => {
    cy.get('h1').should('contain', 'Refeição vegana').and('be.visible');
    cy.get('select').should('be.visible');
    cy.get('input[placeholder="Ex: Arroz e feijão"]').should('be.visible');
    cy.contains('button', 'Buscar').should('be.visible');
  });

  it('Deve alterar o tipo de refeição e exibir uma nova sugestão', () => {
    cy.get('select').select('Saladas');

    cy.get('h2').invoke('text').then(firstMeal => {
      cy.get('select').select('Sopas');
      cy.get('h2').invoke('text').should('not.eq', firstMeal);
    });
  });

  it('Deve permitir buscar um prato e exibir corretamente o resultado', () => {
    cy.get('input[placeholder="Ex: Arroz e feijão"]').type('Massa à bolonhesa');
    cy.get('button').contains('Buscar').click();

    cy.get('h2').should('contain', 'Massa à bolonhesa');
    cy.get('ul').within(() => {
      cy.get('li').should('contain', 'lentilha');
      cy.get('li').should('contain', 'azeite');
      cy.get('li').should('contain', 'massa de espaguete');
    });
  });

  it('Deve exibir corretamente os ingredientes da refeição sugerida', () => {
    cy.get('h2').invoke('text').as('mealTitle');
    cy.get('ul li').should('have.length.greaterThan', 0);
  });
});
