describe("constact form", {}, () => {
  //we can add setting on per suite or even per test level
  before(() => {}); //runs before all the tests only one
  beforeEach(() => {
    cy.task();
    cy.visit("/about");
  }); // runs before every test
  //clean up is better to be done on the before hooks instead of after
  afterEach(() => {
    //runs after each test
  });

  after(() => {
    //runs after all tests
  });
  it("should submit the form", { browser: "firefox" }, () => {
    cy.task("seedDatabase", "filename.cvs").then((returnValue) => {
      // ... use returnValue
    }); //code that runs outside of the browser
    cy.getById("contact-input-message").type("Hello world");
    cy.getById("contact-input-name").type("John Does");
    // cy.get('[data-cy="contact-btn-submit"]')
    //   .contains("Send Message")
    //   .and("not.have.attr", "disabled"); //and is an alternative of should
    cy.get('[data-cy="contact-btn-submit"]').then((el) => {
      //el.text().should(); should doesnt exist here
      expect(el.attr("disabled")).to.be.undefined; //this test fails if the the button should not be disabled
      expect(el.text()).to.contain("Send Message"); //to.eq
    });
    cy.getById("contact-input-email").type("test@example.com{enter}");
    cy.submitForm();
    //const btn = cy.get('[data-cy="contact-btn-submit"]');
    // cy.btn.click(); storing a command like this works but s not recomanded because get doesnt return the button element
    // cy.btn.contains("Sending...").and("have.attr", "disabled"); instead use alliad

    cy.get('[data-cy="contact-btn-submit"]').as("submitBtn");
    //cy.get("@submitBtn").click();
    cy.get("@submitBtn").contains("Sending...").and("have.attr", "disabled");
  });

  it("should validate the form input", () => {
    cy.submitForm();
    cy.getById("contact-btn-submit").then((el) => {
      expect(el).to.not.have.attr("disabled");
      expect(el.text()).to.not.equal("Sending...");
    });
    cy.getById("contact-btn-submit").contains("Send Message"); // DOESNT FAIL BECAUSE THERE IS A LIMIT OF 4 MINS -its not a good test

    cy.getById("contact-input-message").as("msgInput");
    cy.get("@msgInput").blur();
    // cy.get("@msgInput")
    //   .parent()
    //   .then((el) => {
    //     expect(el.attr("class")).to.contains("invalid");
    //   }); this doesnt work when running the tests with cypress run
    //should returns the attr
    cy.get("@msgInput")
      .parent()
      .should("have.attr", "class")
      .and("match", /invalid/); // "equal" will check for the exact value

    cy.get('[data-cy = "contact-input-name').as("nameInput");
    cy.get("@nameInput").focus().blur();
    // cy.get("@nameInput")
    //   .parent()
    //   .then((el) => {
    //     expect(el.attr("class")).to.contains("invalid");
    //   });
    cy.get("@nameInput")
      .parent()
      .should("have.attr", "class")
      .and("match", /invalid/);

    cy.screenshot();
    cy.get('[data-cy = "contact-input-email').as("emailInput");
    cy.screenshot();

    cy.get("@emailInput").focus().blur();

    cy.get("@emailInput")
      .parent()
      .should("have.attr", "class")
      .and("match", /invalid/);

    cy.get("@emailInput")
      .parent()
      .should((el) => {
        expect(el.attr("class")).not.to.be.undefined;
        expect(el.attr("class")).contains("invalid");
      }); //should is more stable than then, chaining multiple should is suggested as better
  });
});
