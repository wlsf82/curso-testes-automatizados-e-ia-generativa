describe('GET /customers', () => {
  context('Successful requests', () => {
    context('Default query parameters', () => {
      it('returns the response structure', () => {})
    })

    context('Size filtering', () => {
      it('returns only Small customers', () => {})

      it('returns only Medium customers', () => {})

      it('returns only Enterprise customers', () => {})
    })

    context('Industry filtering', () => {
      it('returns only Logistics customers', () => {})

      it('returns only Retail customers', () => {})
    })

    context('Pagination', () => {
      it('returns customers from page 2', () => {})

      it('returns the requested number of customers', () => {})
    })
  })

  context('Failed requests', () => {
    context('Page validation', () => {
      it('returns an error when page is 0', () => {})

      it('returns an error when page is -1', () => {})
    })

    context('Limit validation', () => {
      it('returns an error when limit is 0', () => {})

      it('returns an error when limit is -1', () => {})
    })

    context('Size validation', () => {
      it('returns an error when size is unsupported', () => {})
    })

    context('Industry validation', () => {
      it('returns an error when industry is unsupported', () => {})
    })
  })
})