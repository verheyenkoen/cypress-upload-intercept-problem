Cypress.Commands.add('deleteRecord', {prevSubject: 'optional'}, (subject, arg) => {
    let recordId = null;

    subject = subject || arg;

    if (Cypress._.isFinite(subject)) {
        recordId = parseInt(subject);
    } else if (Cypress._.isString(subject)) {
        let matches = null;

        if (/^\d+$/.test(subject)) {
            recordId = parseInt(subject);
        } else if (matches = subject.match(/\/librecat\/record\/edit\/(\d+)$/)) {
            recordId = parseInt(matches[1]);
        }
    }

    if (!recordId) {
        throw new Error(`Cannot delete record based on subject "${Cypress.utils.stringifyActual(subject)}"`);
    }

    let log = Cypress.log({
        name: 'deleteRecord',
        message: [recordId],
        consoleProps: () => {
            return {
                subject: subject,
                recordId: recordId,
            };
        },
    });

    cy.visit('/librecat/record/edit/' + recordId, {log: false});

    cy.on('window:confirm', () => true);

    cy.contains('.btn.btn-danger', 'Delete', {log: false})
        .click({log: false})
        .then(function() {
            log.snapshot().end();
        });
});
