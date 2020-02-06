const { ApolloClient } = require('apollo-client')
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const nodeFetch = require('node-fetch')

module.exports = async options => {
  const {
    url,
    headers = {},
    fetch = nodeFetch,
    fetchOptions = {},
    createLink,
  } = options

  let link
  if (createLink) {
    link = await createLink(options)
  } else {
    link = createHttpLink({
      uri: url,
      fetch,
      fetchOptions,
      headers: typeof headers === 'function' ? await headers() : headers,
    })
  }

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}
