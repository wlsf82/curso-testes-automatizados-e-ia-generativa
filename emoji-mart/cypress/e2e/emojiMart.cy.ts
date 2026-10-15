describe('Emoji Mart App', () => {
  const openCart = () => {
    cy.get('.lucide-shopping-cart').click();
  };

  const addSmilingFaceToCart = () => {
    cy.get('[data-testid="emoji-card"]')
      .contains('Smiling Face')
      .parents('[data-testid="emoji-card"]')
      .within(() => {
        cy.contains('button', 'Add to Cart').click();
      });
  };

  const goToCheckout = () => {
    addSmilingFaceToCart();
    openCart();
    cy.contains('button', 'Proceed to Checkout').click();
  };

  const fillCheckout = () => {
    cy.get('#email').type('renata@test.com');
    cy.get('#name').type('Renata Meirelles');
    cy.get('#address').type('Rua Teste, 123');
    cy.get('#city').type('São José dos Campos');
    cy.get('#country').type('Brazil');
    cy.get('#cardNumber').type('4111111111111111');
    cy.get('#expiryDate').type('12/30');
    cy.get('#cvv').type('123');
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the homepage with all emoji information', () => {
    cy.contains('h1', 'EmojiMart').should('be.visible');

    cy.get('input[placeholder="Search emojis..."]')
      .should('be.visible');

    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6)
      .each(($card) => {
        cy.wrap($card).find('h3').should('be.visible');
        cy.wrap($card).find('p').should('be.visible');
        cy.wrap($card).contains('$').should('be.visible');
        cy.wrap($card)
          .contains('button', 'Add to Cart')
          .should('be.visible');
      });
  });

  it('should open emoji details', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket')
      .contains('🚀')
      .click();

    cy.contains('h2', 'Rocket').should('be.visible');
    cy.contains('A rocket shooting up into space').should('be.visible');
    cy.contains('$6.99').should('be.visible');
    cy.contains('button', 'Add to Cart').should('be.visible');
    cy.contains('button', '← Back to all emojis').should('be.visible');
  });

  it('should go back from emoji details to all emojis', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket')
      .contains('🚀')
      .click();

    cy.contains('button', '← Back to all emojis').click();

    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6);
  });

  it('should add an emoji to the cart from details page', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket')
      .contains('🚀')
      .click();

    cy.contains('button', 'Add to Cart').click();

    openCart();

    cy.get('[data-testid="cart-item"]')
      .should('contain', 'Rocket')
      .and('contain', '🚀');
  });

  it('should search emojis by name', () => {
    cy.get('input[placeholder="Search emojis..."]')
      .type('Rocket');

    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 1)
      .and('contain', 'Rocket');
  });

  it('should search without case sensitivity', () => {
    cy.get('input[placeholder="Search emojis..."]')
      .type('rocket');

    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 1)
      .and('contain', 'Rocket');
  });

  it('should update search results in real time', () => {
    const search = cy.get(
      'input[placeholder="Search emojis..."]'
    );

    search.type('R');

    cy.get('[data-testid="emoji-card"]')
      .its('length')
      .should('be.greaterThan', 1);

    search.type('ocket');

    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 1)
      .and('contain', 'Rocket');
  });

  it('should add an emoji directly from homepage to the cart', () => {
    addSmilingFaceToCart();
    openCart();

    cy.get('[data-testid="cart-item"]')
      .should('contain', 'Smiling Face')
      .and('contain', '😊');
  });

  it('should view and close the cart', () => {
    addSmilingFaceToCart();

    openCart();

    cy.contains('h2', 'Your Cart').should('be.visible');

    cy.get('button svg.lucide-x').click();

    cy.contains('h2', 'Your Cart').should('not.exist');
  });

  it('should increase and decrease item quantity', () => {
    addSmilingFaceToCart();

    openCart();

    cy.get('[data-testid="cart-item-counter"]')
      .should('contain', '1');

    cy.get('button svg.lucide-plus-circle').click();

    cy.get('[data-testid="cart-item-counter"]')
      .should('contain', '2');

    cy.get('button svg.lucide-minus-circle').click();

    cy.get('[data-testid="cart-item-counter"]')
      .should('contain', '1');
  });

  it('should remove an emoji from the cart', () => {
    addSmilingFaceToCart();

    openCart();

    cy.get('button svg.lucide-trash2').click();

    cy.get('[data-testid="empty-cart"]')
      .should('contain', 'Your cart is empty');
  });

  it('should proceed to checkout', () => {
    goToCheckout();

    cy.contains('Contact Information').should('be.visible');
    cy.contains('Shipping Address').should('be.visible');
    cy.contains('Payment Information').should('be.visible');
  });

  it('should show checkout fields and total amount', () => {
    goToCheckout();

    cy.get('#email').should('be.visible');
    cy.get('#name').should('be.visible');
    cy.get('#address').should('be.visible');
    cy.get('#city').should('be.visible');
    cy.get('#country').should('be.visible');
    cy.get('#cardNumber').should('be.visible');
    cy.get('#expiryDate').should('be.visible');
    cy.get('#cvv').should('be.visible');

    cy.contains('Total Amount:').should('be.visible');
    cy.contains('$4.99').should('be.visible');
  });

  it('should require a valid email format', () => {
    goToCheckout();

    cy.get('#email')
      .type('email-invalido');

    cy.get('#email')
      .then(($input) => {
        expect(
          ($input[0] as HTMLInputElement).checkValidity()
        ).to.equal(false);
      });
  });

  it('should return to the store from checkout', () => {
    goToCheckout();

    cy.contains('button', '← Back to store').click();

    cy.contains('h1', 'EmojiMart').should('be.visible');
    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6);
  });

  it('should complete a purchase', () => {
    goToCheckout();

    fillCheckout();

    cy.contains('button', 'Complete Purchase').click();

    cy.contains(
      'h1',
      'Thank You for Your Purchase!'
    ).should('be.visible');

    cy.contains(
      "Your order has been successfully placed. We've sent a confirmation email with your order details."
    ).should('be.visible');

    cy.contains('Order Number').should('be.visible');
  });

  it('should display an order number after purchase', () => {
    goToCheckout();
    fillCheckout();

    cy.contains('button', 'Complete Purchase').click();

    cy.contains('Order Number')
      .next()
      .invoke('text')
      .should('match', /^[A-Z0-9]{8}$/);
  });

  it('should return to store from thank you page', () => {
    goToCheckout();
    fillCheckout();

    cy.contains('button', 'Complete Purchase').click();

    cy.contains('button', 'Back to Store').click();

    cy.contains('h1', 'EmojiMart').should('be.visible');
    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6);
  });

  it('should work on a mobile viewport', () => {
    cy.viewport('iphone-x');

    cy.contains('h1', 'EmojiMart').should('be.visible');
    cy.get('input[placeholder="Search emojis..."]')
      .should('be.visible');
    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6);
  });

  it('should work on a tablet viewport', () => {
    cy.viewport('ipad-2');

    cy.contains('h1', 'EmojiMart').should('be.visible');
    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6);
  });

  it('should work on a desktop viewport', () => {
    cy.viewport(1440, 900);

    cy.contains('h1', 'EmojiMart').should('be.visible');
    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6);
  });
});
