describe('The quick and easy upload feature', function () {
  it('using cy.route()', function () {
    cy.server()
    cy.route('POST', '/librecat/upload').as('upload')

    cy.login()

    cy.visit('/librecat')

    cy.contains('.btn', 'Add new Publication').click()

    cy.fixture('logo.png').as('logo')

    cy.get('.dropzone').then(function ($dz) {
      const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')
      blob.name = 'logo.png'

      let dropzone = $dz.prop('dropzone')
      dropzone.addFile(blob)

      cy.log('Added file logo.png')
    })

    cy.wait('@upload')

    cy.get('.dropzone form').within(function () {
      cy.get(':checkbox').click()

      cy.get(':submit').click()
    })

    cy.contains('h3', 'Imported 1 record(s) from dropzone')
      .should('be.visible')
      .next('ul')
      .find('li')
      .should('have.length', 1)
      .should('contain', 'New Quick And Easy Publication - Will be edited by LibreCat team')
      .find('a:contains("Edit")')
      .click()

    cy.get('.dz-file-preview')
      .should('have.length', 1)
      .find('.row')
      .first()
      .find('a[href*="/download/"]')
      .should('have.text', 'logo.png')
  })

  it('using cy.intercept()', function () {
    cy.intercept('POST', '/librecat/upload').as('upload')

    cy.login()

    cy.visit('/librecat')

    cy.contains('.btn', 'Add new Publication').click()

    cy.fixture('logo.png').as('logo')

    cy.get('.dropzone').then(function ($dz) {
      const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')
      blob.name = 'logo.png'

      let dropzone = $dz.prop('dropzone')
      dropzone.addFile(blob)

      cy.log('Added file logo.png')
    })

    cy.wait('@upload')

    cy.get('.dropzone form').within(function () {
      cy.get(':checkbox').click()

      cy.get(':submit').click()
    })

    cy.contains('h3', 'Imported 1 record(s) from dropzone')
      .should('be.visible')
      .next('ul')
      .find('li')
      .should('have.length', 1)
      .should('contain', 'New Quick And Easy Publication - Will be edited by LibreCat team')
      .find('a:contains("Edit")')
      .click()

    cy.get('.dz-file-preview')
      .should('have.length', 1)
      .find('.row')
      .first()
      .find('a[href*="/download/"]')
      .should('have.text', 'logo.png')
  })

  afterEach(function () {
    cy.login('einstein', 'einstein')

    cy.visit('/librecat')

    cy.get('a:contains("New Quick And Easy Publication - Will be edited by LibreCat team")')
      .map('href')
      .each(cy.deleteRecord)
  })
})
