import * as dataTest from '../fixtures/data-test'

describe('TroubleShoot Panel detection', { tags: ['@admin'] }, () => {
  before( function() {
    cy.uiLoginAsClusterAdminForUser("first");

  });

  beforeEach( function() {
  });

  after( function() {
    cy.uiLogoutClusterAdminForUser("first");
  });

  it('basic elements validation ',{tags:['@smoke']}, () => {
    cy.clickNavLink(['Home', 'Projects']);
    cy.openTroubeshootPanel();
    //troubelShoot Panel title div
    //<div class="pf-v5-l-flex pf-m-gap-none tp-plugin__popover-title-bar">
    cy.get('div.tp-plugin__popover-title-bar')
      .should('exist')
      .within(() => {
	cy.contains('h1', 'Troubleshooting');
	cy.get('h1').find('button').should('exist')
	cy.get('button[aria-label="Close"]').should('exist');
	cy.get('svg.tp-plugin__popover-close').should('exist');
      })

    cy.contains('h1', 'Troubleshooting').find('button').first().click();
    cy.contains('.pf-v5-c-popover__title-text', 'Quickly diagnose and resolve issues by exploring correlated observability signals for resources.').should('exist');
    cy.contains('h1', 'Troubleshooting').find('button').first().click();

    //troubelShoot Panel query-container
    //<div pf-v5-c-expandable-section pf-m-expanded.pf-m-detached pf-m-indented tp-plugin__panel-query-container>
    //troubelShoot Panel query-container -- control div
    cy.get('div.tp-plugin__popover-content')
      .should('exist')
      .within(() => {
        cy.contains('button','Focus');
        cy.contains('button','Advanced');
	//The refresh button exists
        cy.get('button').eq(2).should('be.visible');
      })
    //Click the force button
    cy.log("before Focus")
    cy.focusTroubeshootPanel();
    //Click the Advance Button
    cy.clickTroubeshootPanelAdvance();
    cy.get('div.tp-plugin__panel-query-container')
      .find('form')
      .within(() => {
        cy.contains('label', 'Time');
        cy.contains('button', 'Recent');
        cy.contains('button', 'Range');
        cy.contains('h6','Since');
        cy.get('div.pf-v5-c-number-input').should('exist');
        cy.contains('h6','Ago');
        cy.contains('button', 'days');
        cy.contains('button', 'Distance');
        cy.contains('button', 'Goal Class');
        cy.contains('label', 'Query').find('button').should('exist');
        cy.get('textarea[id="query-input"]').should('exist');
      });
    //troubelShoot Panel query-container -- topology-container
    //<div class="pf-m-grow tp-plugin__panel-topology-container"><div class="pf-v6-l-stack"><div class="pf-v6-l-stack__item pf-m-fill pf-topology-container"><div class="pf-topology-content">
    cy.get('div.tp-plugin__panel-topology-container').should('exist');
    cy.get('div[data-test-id="topology"]').should('exist');
    cy.get('g[data-id="korrel8r_graph"]')
      .within(() => {
        cy.get('ellipse').should('exist');
        cy.get('g[class="pf-topology__node__label__badge"]').should('exist');
        cy.get('rect[class="pf-topology__node__action-icon__background"]').should('exist');
        cy.get('g[data-test-id="edge-handler"]').should('exist');
      })
    cy.get('span.pf-topology-control-bar')
      .within(() => {
        cy.get('button[id="zoom-in"]').should('exist');
        cy.get('button[id="zoom-out"]').should('exist');
        cy.get('button[id="fit-to-screen"]').should('exist');
        cy.get('button[id="reset-view"]').should('exist');
      })

     //Three nodes should be show when we focus on home->projects
    cy.get('g[data-id="korrel8r_graph"]')          // get the parent <g>
      .find('g[data-id="k8s:Project.v1.project.openshift.io"]') // find the child <g>
      .should('exist')
      .find('text')
      .contains('K8s Project')
      .should('exist')
    cy.get('g[data-id="korrel8r_graph"]')          // get the parent <g>
      .find('g[data-id="k8s:ClusterVersion.v1.config.openshift.io"]') // find the child <g>
      .should('exist')
      .find('text')
      .contains('K8s ClusterVersion')
      .should('exist')
    cy.get('g[data-id="korrel8r_graph"]')          // get the parent <g>
      .find('g[data-id="k8s:Network.v1.operator.openshift.io"]') // find the child <g>
      .should('exist')
      .find('text')
      .contains('K8s Network')
      .should('exist')
  });
})
