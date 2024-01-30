/// <reference types="cypress"/>

describe("Signup", () => {
  let randomString = Math.random().toString(36).substring(2);
  let username = "auto" + randomString;
  let email = "auto_" + randomString + "@gmail.com";
  let password = "Test123!";
  it("Test Valid Signup", () => {
    cy.visit("http://localhost:4200/");
    cy.server();
    cy.route("POST", "**/users").as("newUser");
    cy.get(".nav").contains("Sign up").click();
    cy.get("[formcontrolname='username']").type(username);
    cy.get("[formcontrolname='email']").type(email);
    cy.get("[formcontrolname='password']").type(password);
    cy.get("button").contains("Sign up").click();
    cy.wait("@newUser");
    cy.get("@newUser").should((xhr) => {
      expect(xhr.status).to.eq(201);
      expect(xhr.request.body.user.username).to.eq(username);
      expect(xhr.request.body.user.email).to.eq(email);
    });
  });

  it("Test Valid Login", () => {
    cy.visit("http://localhost:4200/");

    cy.server();
    cy.route("GET", "**/tags", "fixture:popularTags.json");
    cy.get(".nav").contains("Sign in").click();
    cy.get("[formcontrolname='email']").type(email);
    cy.get("[formcontrolname='password']").type(password);
    cy.get("button").contains("Sign in").click();
    cy.get(":nth-child(4) > .nav-link").should("be.visible");
    cy.get(".tag-list")
      .should("contain", "qauni")
      .and("contain", "automation-testing");
  });

  it("Mock Global Feed Data", () => {
    cy.server();
    cy.route("GET", "**/articles?**", "fixture:articles.json");
    cy.route("GET", "**/feed?**", "fixture:feed.json");
    cy.get(".nav-link").contains(" Global Feed ").click();
    cy.get(":nth-child(1) > .article-preview > .preview-link > h1").should(
      "have.text",
      "Im trying to test this out",
    );
  });
});
