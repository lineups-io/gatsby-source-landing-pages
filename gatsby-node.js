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
const connect = require('./client')
const query = require('./query')

exports.sourceNodes = ({ actions, store, cache, createNodeId }, { uri, key, account }) => {
  const { createNode, createNodeField } = actions

  const client = connect(uri, key)
  const variables = { account }

  return client.query({ query, variables }).then(({ data }) => {
    console.log('[gatsby-source-landing-pages] creating site node', 1)
    createNode(SiteNode(data.site))

    const createMarkdownNodes = ['privacyPolicy', 'termsOfUse', 'websiteDisclaimer'].reduce(
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

    console.log('[gatsby-source-landing-pages] creating market nodes', data.markets.count)
    const createMarkets = data.markets.items.reduce(
      (acc, market) => acc.then(() => {
        const marketNode = MarketNode(market)
        marketNode.apartments___NODE =
          market.apartments.items.map(a => ApartmentNode(a).id)
        return createNode(marketNode)
      }),
      Promise.resolve()
    )

    console.log('[gatsby-source-landing-pages] creating apartment nodes', data.apartments.count)
    const createApartments = data.apartments.items.reduce(
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
          console.error('[gatsby-source-landing-pages] create remote file node', e)
          return createNode(apartmentNode)
        })
      }),
      createMarkets
    )

    console.log('[gatsby-source-landing-pages] creating page nodes', data.pages.count)
    return data.pages.items.reduce(
      (acc, page) => acc.then(() => {
        const pageNode = PageNode(page)
        pageNode.apartments___NODE = page.apartments.items.map(a => ApartmentNode(a).id)
        return createNode(pageNode)
      }),
      createApartments
    )
  })
}

exports.onCreateNode = ({ node, actions }) => {
  if (node.internal.type === 'MarkdownRemark') {
    const { createNodeField } = actions
    createNodeField({ node, name: 'template', value: node.frontmatter.template })
    createNodeField({ node, name: 'slug', value: node.frontmatter.path })
  }
}
