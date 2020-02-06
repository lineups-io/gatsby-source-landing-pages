const { ApolloClient } = require('apollo-client')
const { createHttpLink } = require('apollo-link-http')
const { setContext } = require('apollo-link-context')
const { InMemoryCache } = require('apollo-cache-inmemory')
const fetch = require('node-fetch')

module.exports = (uri, key) => {

  const httpLink = createHttpLink({
    uri,
    fetch,
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: 'Bearer ' + key,
      }
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })
}
