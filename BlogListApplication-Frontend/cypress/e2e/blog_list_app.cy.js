describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: 'Karim',
      name: 'Karim Benzema',
      password: 'thebest'
    }

    const user2 = {
      username: 'Vini Jr',
      name: 'Vinicius',
      password: 'thebest'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to Application')
    cy.contains('Username:')
    cy.contains('Password:')
    cy.contains('Login')
  })

  describe('Login', function() {
    it('Succeeds with correct credentials', function() {
      cy.get('#username').type('Karim')
      cy.get('#password').type('thebest')
      cy.contains('Login').click()
      cy.contains('Karim Benzema Logged In')
    })

    it('Fails with wrong credentials', function() {
      cy.get('#username').type('Karim')
      cy.get('#password').type('goal')
      cy.contains('Login').click()
      cy.contains('Wrong Username or Password')
      cy.get('.error').should('contain', 'Wrong Username or Password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Karim', password: 'thebest' })
      cy.createBlog({ title: 'hola', author: 'Hola', url: 'www.hola.com' })
    })

    it('A blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('#title').type('Hala Madrid')
      cy.get('#author').type('Karim')
      cy.get('#url').type('www.realmadrid.com')
      cy.get('.createButton').click()
      cy.contains('A new blog Hala Madrid By Karim')
      cy.get('.success').should('contain','A new blog Hala Madrid By Karim')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('.visibleContent').should('contain', 'Hala Madrid Karim')
    })

    it('The user can like the blog', function() {
      cy.get('.viewButton').click()
      cy.get('.likeButton').click()
      cy.get('.blog').should('contain', '1')
    })

    it('The user who created a blog can delete it', function() {
      cy.createBlog({ title: 'Real Madrid', author: 'Madrid', url: 'www.realmadrid.com' })
      cy.contains('Real Madrid Madrid').parent().find('.viewButton').click()
      cy.contains('Real Madrid Madrid').parent().find('.removeButton').click()
    })

    it('Only the creator can see the delete button of a blog', function() {
      cy.login({ username: 'Vini Jr', password: 'thebest' })
      cy.contains('View').click()
      cy.get('.blog').should('not.contain', 'Remove')
    })

    it('The blogs are ordered according to likes', function () {
      cy.createBlog({ title: 'River Campeon', author: 'Ortega', url: 'www.river.com' })
      cy.createBlog({ title: 'Real Madrid Campeon', author: 'Vini', url: 'www.realmadrid.com' })
      cy.contains('Real Madrid Campeon Vini').parent().find('.viewButton').click()
      cy.contains('Real Madrid Campeon Vini').parent().find('.likeButton').click()
      cy.wait(2000)
      cy.contains('Real Madrid Campeon Vini').parent().find('.likeButton').click()
      cy.contains('River Campeon Ortega').parent().find('.viewButton').click()
      cy.contains('River Campeon Ortega').parent().find('.likeButton').click()

      cy.get('.bloglist').eq(0).should('contain', 'Real Madrid Campeon Vini')
      cy.get('.bloglist').eq(1).should('contain', 'River Campeon Ortega')
      cy.get('.bloglist').eq(2).should('contain', 'hola Hola')
    })

  })
})
