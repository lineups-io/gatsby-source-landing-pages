const { ApolloClient } = require('apollo-client')
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const nodeFetch = require('node-fetch')

module.exports = options => {
  const {
    url,
    headers = {},
    fetch = nodeFetch,
    fetchOptions = {},
  } = options

  const link = createHttpLink({
    uri: url,
    fetch,
    fetchOptions,
    headers,
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}
