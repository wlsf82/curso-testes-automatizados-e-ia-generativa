describe('Meal Suggestion App', () => {
  beforeEach(() => {
    cy.visit('https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html');
  });

  it('Deve carregar a página corretamente e exibir os elementos principais', () => {
    cy.contains('h1', 'Refeição vegana 🌱').should('be.visible');
    cy.contains('label', 'Tipo:').should('be.visible');
    cy.get('#meal-type-filter').should('be.visible');
    cy.contains('label', 'Busca:').should('be.visible');
    cy.get('input[placeholder="Ex: Arroz e feijão"]').should('be.visible')
    cy.contains('button', 'Buscar').should('be.visible');
    cy.get('#meal-container').should('be.visible')
  });

  it('Deve gerar uma sugestão de refeição ao carregar a página', () => {
    cy.get('#meal-container')
      .as('mealContainer')
      .find('#meal-name')
      .should('be.visible')
    cy.get('@mealContainer')
      .find('#ingredients-label')
      .should('be.visible')
    cy.get('@mealContainer')
      .find('#ingredients-list')
      .should('be.visible')
  });
});
