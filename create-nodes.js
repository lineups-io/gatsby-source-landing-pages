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

exports.createSiteNode = ({ actions, store, cache, createNodeId }, { account, ...options }) => {
  const { createNode } = actions

  const client = connect(options)
  const query = getSiteInfo
  const variables = { account }

  return client.query({ query, variables }).then(({ data }) => {
    console.log(`${ pluginPrefix } creating site node`, 1)
    createNode(SiteNode(data.site))

    const markdown = []
    data.site.footer.menu.forEach(menu => {
      menu.subMenu.forEach(subMenu => {
        if (subMenu.markdown) {
          markdown.push(subMenu)
        }
      })
    })

    return markdown.reduce((acc, md) => acc.then(() => {
      return createFileNodeFromBuffer({
        buffer: Buffer.from(`---\ntitle: ${ md.title }\npath: ${ md.href }\n---\n${ md.markdown }`),
        store,
        cache,
        createNode,
        createNodeId,
        name: md.title,
        ext: '.md',
      })
    }), Promise.resolve())
  })
}

exports.createApartmentNodes = (
  { actions, store, cache, createNodeId },
  { account, offset = 0, limit = 25, ...options }
) => {
  const { createNode } = actions

  const client = connect(options)
  const query = getApartments
  const variables = { account, offset, limit }

  return client.query({ query, variables }).then(({ data }) => {
    const { apartments: { items, count } } = data
    const end = offset + items.length
    console.log(`${ pluginPrefix } creating apartment nodes ${ offset + 1 }-${ end } (out of ${ count })`)
    return items.reduce(
      (acc, apartment) => acc.then(() => {
        const apartmentNode = ApartmentNode(apartment)
        return createNode(apartmentNode)
      }),
      Promise.resolve()
    ).then(() => ({ next: end < count ? end : 0 }))
  })
}

exports.createPageNodes = (
  { actions, store, cache, createNodeId },
  { account, offset = 0, limit = 25, ...options }
) => {
  const { createNode } = actions

  const client = connect(options)
  const query = getPages
  const variables = { account, offset, limit }

  return client.query({ query, variables }).then(({ data }) => {
    const { pages: { items, count } } = data
    const end = offset + items.length
    console.log(`${ pluginPrefix } creating page nodes ${ offset + 1 }-${ end } (out of ${ count })`)
    return items.reduce(
      (acc, page) => acc.then(() => {
        if (page.apartments.count > 0) {
          const pageNode = PageNode(page)
          pageNode.apartments___NODE = page.apartments.items.map(a => ApartmentNode(a).id)
          return createNode(pageNode)
        } else {
          return Promise.resolve()
        }
      }),
      Promise.resolve()
    ).then(() => ({ next: end < count ? end : 0 }))
  })
}
