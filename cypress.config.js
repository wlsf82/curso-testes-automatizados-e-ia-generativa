const { defineConfig } = require('cypress')

module.exports = defineConfig({
  allowCypressEnv: true,

  env: {
    apiUrl: 'http://localhost:3001'
  },

  e2e: {
    setupNodeEvents(on, config) {}
  }
})