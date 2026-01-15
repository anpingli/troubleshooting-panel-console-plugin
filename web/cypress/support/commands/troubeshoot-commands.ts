/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import { guidedTour } from '../../views/tour';
import * as dataTest from '../../fixtures/data-test';
import * as helperfuncs from '../views/utils';

declare global {
  namespace Cypress {
    interface IndexField {
      name: string;
      value?: string; 
    }
    interface Chainable<Subject> {
      openTroubeshootPanel();
    }
  }
}

function retryOpenTroubeshootPanel(count = 5) {
  if (count === 0) {
    throw new Error('Popup did not appear after clicking the trigger')
  }
  cy.document().then(doc => {
    const $popup = Cypress.$('div.tp-plugin__popover-title-bar:visible', doc)
    if ($popup.length) {
      // popup appeared
      cy.log('Popup appeared')
      return
    } else {
      // Step 1: click trigger button
      cy.byLegacyTestID(dataTest.LegacyTestIDs.AppicationLauncher).click()
      cy.get('div.co-app-launcher').should('be.visible')
      cy.byButtonText('Signal Correlation').click()
      cy.wait(6000) // wait for 6 seconds
      // retry after small delay
      retryOpenTroubeshootPanel(count - 1)
    }
  })
}

Cypress.Commands.add('openTroubeshootPanel', () => {
  cy.window().its('document.readyState').should('eq', 'complete');
  // Retry until popup div appears.
  retryOpenTroubeshootPanel(5)
  cy.get('div.tp-plugin__panel-topology-container').should('be.visible');
})

Cypress.Commands.add('closeTroubeshootPanel', () => {
  cy.get('div.tp-plugin__popover')
    .find('svg.tp-plugin__popover-close')
    .click({force: true});
})

Cypress.Commands.add('focusTroubeshootPanel', () => {
  //cy.get('div. tp-plugin__panel-query-container').contains('button', 'Forcs').click();
  cy.get('div.tp-plugin__panel-query-container')
    .contains('button', 'Focus')
    .click({force: true});
  cy.get('body').trigger('mouseover');
  cy.get('body').click(0, 0);
  cy.get('div.tp-plugin__panel-topology-container').should('exist');
})

Cypress.Commands.add('refreshTroubeshootPanel', () => {
  //There’s no alternative way to locate this button
  cy.get('div.tp-plugin__panel-query-container')
    .find('button')
    .eq(2)
    .click({focus: true});
  cy.get('div.tp-plugin__panel-topology-container').should('be.visible')
})

Cypress.Commands.add('clickTroubeshootPanelAdvance', () => {
  cy.get('div.tp-plugin__panel-query-container')
    .contains('button', 'Advanced')
    .click({focus: true});
})

Cypress.Commands.add('getTroubeshootPanelQueryText', () => {
  //Note: The advance tab need to be expaned before run this commands.
  return cy.get('div.tp-plugin__panel-query-container').find('textarea#query-input').invoke('val')
})
