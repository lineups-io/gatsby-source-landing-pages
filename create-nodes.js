const {
  createRemoteFileNode,
  createFileNodeFromBuffer,
} = require('gatsby-source-filesystem')

const {
  ApartmentNode,
  MarketNode,
  PageNode,
  SiteNode,
} = require('./nodes')

const {
  getSiteInfo,
  getMarkets,
  getApartments,
  getPages,
} = require('./query')

const connect = require('./client')

const pluginPrefix = '[gatsby-source-landing-pages]'

exports.createSiteNode = ({ actions, store, cache, createNodeId }, { uri, key, account }) => {
  const { createNode, createNodeField } = actions

  const client = connect(uri, key)
  const query = getSiteInfo
  const variables = { account }

  return client.query({ query, variables }).then(({ data }) => {
    console.log(`${ pluginPrefix } creating site node`, 1)
    const siteNode = SiteNode(data.site)

    const fonts = data.site.fonts.map(font => `
      @font-face {
          family: '${ font.family }';
          style: ${ font.style };
          weight: ${ font.weight };
          display: ${ font.display };
          src: url('${ font.url }') format('${ font.format }');
      }
    `).join('')

    const createSiteNode = createFileNodeFromBuffer({
          buffer: Buffer.from(fonts),
          store,
          cache,
          createNode,
          createNodeId,
          name: 'fonts',
          ext: '.css',
    }).then(() => createNode(siteNode))

    return ['privacyPolicy', 'termsOfUse', 'websiteDisclaimer'].reduce(
      (acc, name) => acc.then(() => {
        data.site[name]
        ? createFileNodeFromBuffer({
          buffer: Buffer.from(data.site[name]),
          store,
          cache,
          createNode,
          createNodeId,
          name,
          ext: '.md',
        })
        : Promise.resolve()
    }), Promise.resolve())
  })
}

exports.createMarketNodes = (
  { actions, store, cache, createNodeId },
  { uri, key, account, offset = 0, limit = 25 }
) => {
  const { createNode, createNodeField } = actions

  const client = connect(uri, key)
  const query = getMarkets
  const variables = { account, offset, limit }

  return client.query({ query, variables }).then(({ data }) => {
    const { markets: { items, count } } = data
    const end = offset + items.length - 1
    console.log(`${pluginPrefix} creating market nodes ${ offset }-${ end } (out of ${ count })`)
    return items.reduce(
      (acc, market) => acc.then(() => {
        const marketNode = MarketNode(market)
        marketNode.apartments___NODE =
          market.apartments.items.map(a => ApartmentNode(a).id)
        return createNode(marketNode)
      }),
      Promise.resolve()
    ).then(() => ({ next: end + 1 < count ? end + 1 : 0 }))
  })
}

exports.createApartmentNodes = (
  { actions, store, cache, createNodeId },
  { uri, key, account, offset = 0, limit = 25 }
) => {
  const { createNode, createNodeField } = actions

  const client = connect(uri, key)
  const query = getApartments
  const variables = { account, offset, limit }

  return client.query({ query, variables }).then(({ data }) => {
    const { apartments: { items, count } } = data
    const end = offset + items.length - 1
    console.log(`${pluginPrefix} creating apartment nodes ${ offset }-${ end } (out of ${ count })`)
    return items.reduce(
      (acc, apartment) => acc.then(() => {
        const apartmentNode = ApartmentNode(apartment)
        return createRemoteFileNode({
          url: encodeURI(apartment.defaultPhoto.url),
          store,
          cache,
          createNodeId,
          createNode,
        }).then(fileNode => {
          apartmentNode.defaultPhoto.localFile___NODE = fileNode.id
          return createNode(apartmentNode)
        }).catch(e => {
          console.error(`${ pluginPrefix } create remote file node`, e)
          return createNode(apartmentNode)
        })
      }),
      Promise.resolve()
    ).then(() => ({ next: end + 1 < count ? end + 1 : 0 }))
  })
}

exports.createPageNodes = (
  { actions, store, cache, createNodeId },
  { uri, key, account, offset = 0, limit = 25 }
) => {
  const { createNode, createNodeField } = actions

  const client = connect(uri, key)
  const query = getPages
  const variables = { account, offset, limit }

  return client.query({ query, variables }).then(({ data }) => {
    const { pages: { items, count } } = data
    const end = offset + items.length - 1
    console.log(`${pluginPrefix} creating page nodes ${ offset }-${ end } (out of ${ count })`)
    return items.reduce(
      (acc, page) => acc.then(() => {
        const pageNode = PageNode(page)
        pageNode.apartments___NODE = page.apartments.items.map(a => ApartmentNode(a).id)
        return createNode(pageNode)
      }),
      Promise.resolve()
    ).then(() => ({ next: end + 1 < count ? end + 1 : 0 }))
  })
}
