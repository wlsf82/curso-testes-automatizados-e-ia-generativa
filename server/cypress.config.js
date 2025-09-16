const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    env: {
      apiUrl: 'http://localhost:3001'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
