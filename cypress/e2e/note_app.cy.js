describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'Tomer Zibman',
      username: 'tomerzibman',
      password: 'testing',
    };
    cy.request('POST', 'http://localhost:3001/api/users', user);
    cy.visit('http://localhost:5173');
  });

  it('front page can be opened', function () {
    cy.contains('Notes');
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2023',
    );
  });

  it('login form can be opened', function () {
    cy.contains('login').click();
    cy.get('#username').type('tomerzibman');
    cy.get('#password').type('testing');
    cy.get('#login-button').click();

    cy.contains('Tomer Zibman logged in');
  });

  it.only('log in fails with the wrong password', function () {
    cy.contains('login').click();
    cy.get('#username').type('tomerzibman');
    cy.get('#password').type('wrong');
    cy.get('#login-button').click();

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid');

    cy.get('html').should('not.contain', 'Tomer Zibman logged in');
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('login').click();
      cy.get('#username').type('tomerzibman');
      cy.get('#password').type('testing');
      cy.get('#login-button').click();
    });

    it('a new note can be created', function () {
      cy.contains('new note').click();
      cy.get('input').type('a new note created by cypress');
      cy.contains('save').click();
      cy.contains('a new note created by cypress');
    });

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click();
        cy.get('input').type('another note cypress');
        cy.contains('save').click();
      });

      it('it can be made not important', function () {
        cy.contains('another note cypress')
          .contains('make not important')
          .click();

        cy.contains('another note cypress').contains('make important');
      });
    });
  });
});
