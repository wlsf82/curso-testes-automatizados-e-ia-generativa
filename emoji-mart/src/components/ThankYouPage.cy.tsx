import React from 'react';
import { ThankYouPage } from './ThankYouPage';

describe('ThankYouPage', () => {
  const orderNumber = '123456';

  it('renders the ThankYouPage component', () => {
    const onBackToStore = cy.stub();
    cy.mount(<ThankYouPage orderNumber={orderNumber} onBackToStore={onBackToStore} />);
    cy.get('[data-testid="check-icon"]').should('be.visible');
    cy.contains('Thank You for Your Purchase!').should('be.visible');
    cy.contains(orderNumber).should('be.visible');
    cy.contains('button', 'Back to Store').should('be.visible');
  });

  it('calls onBackToStore when the button is clicked', () => {
    const onBackToStore = cy.stub();
    cy.mount(<ThankYouPage orderNumber={orderNumber} onBackToStore={onBackToStore} />);
    cy.contains('button', 'Back to Store').click();
    cy.wrap(onBackToStore).should('have.been.calledOnce');
  });
});
