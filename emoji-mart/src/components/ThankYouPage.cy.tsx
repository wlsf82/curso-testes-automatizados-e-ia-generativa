import React from 'react';
import { ThankYouPage } from './ThankYouPage';

describe('ThankYouPage', () => {
  const mockOrderNumber = 'ORDER123';

  beforeEach(() => {
    const mockBackToStore = cy.stub().as('backToStoreHandler');
    // Monta o componente antes de cada teste
    cy.mount(
      <ThankYouPage 
        orderNumber={mockOrderNumber} 
        onBackToStore={mockBackToStore}
      />
    );
  });

  it('deve renderizar corretamente com o número do pedido e mensagem de confirmação', () => {
    // Verifica o título
    cy.contains('h1', 'Thank You for Your Purchase!').should('be.visible');
    
    // Verifica se o número do pedido está sendo exibido
    cy.contains('p', mockOrderNumber).should('be.visible');
    
    // Verifica se o ícone de check está presente
    cy.get('[data-testid="check-icon"]').should('exist');

    cy.contains('Your order has been successfully placed').should('be.visible');
    cy.contains('We\'ve sent a confirmation email').should('be.visible');
  });

  it('deve chamar onBackToStore quando o botão for clicado', () => {
    // Clica no botão "Back to Store"
    cy.contains('button', 'Back to Store').click();
    
    // Verifica se o callback foi chamado
    cy.get('@backToStoreHandler').should('have.been.calledOnce');
  });
});
