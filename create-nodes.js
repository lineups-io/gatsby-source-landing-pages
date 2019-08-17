const {
  createRemoteFileNode,
  createFileNodeFromBuffer,
} = require('gatsby-source-filesystem')

const {
  ApartmentNode,
  PageNode,
  SiteNode,
} = require('./nodes')

const {
  getSiteInfo,
  getApartments,
  getPages,
} = require('./query')

const connect = require('./client')

const pluginPrefix = '[gatsby-source-landing-pages]'

exports.createSiteNode = ({ actions, store, cache, createNodeId }, { uri, key, account }) => {
  const { createNode } = actions

  const client = connect(uri, key)
  const query = getSiteInfo
  const variables = { account }

  return client.query({ query, variables }).then(({ data }) => {
    console.log(`${ pluginPrefix } creating site node`, 1)
    createNode(SiteNode(data.site))

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

exports.createApartmentNodes = (
  { actions, store, cache, createNodeId },
  { uri, key, account, offset = 0, limit = 25 }
) => {
  const { createNode } = actions

  const client = connect(uri, key)
  const query = getApartments
  const variables = { account, offset, limit }

  return client.query({ query, variables }).then(({ data }) => {
    const { apartments: { items, count } } = data
    const end = offset + items.length - 1
    console.log(`${ pluginPrefix } creating apartment nodes ${ offset }-${ end } (out of ${ count })`)
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
          console.log(`${ pluginPrefix } create remote file node`, fileNode.url)
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
  const { createNode } = actions

  const client = connect(uri, key)
  const query = getPages
  const variables = { account, offset, limit }

  return client.query({ query, variables }).then(({ data }) => {
    const { pages: { items, count } } = data
    const end = offset + items.length - 1
    console.log(`${ pluginPrefix } creating page nodes ${ offset }-${ end } (out of ${ count })`)
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
