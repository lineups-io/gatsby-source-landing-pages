const {
  createSiteNode,
  createApartmentNodes,
  createPageNodes,
} = require('./create-nodes')

const forEach = (helpers, plugin, fn) => {
  return fn(helpers, plugin).then(({ next }) => {
    if (next) {
      return forEach(helpers, { ...plugin, offset: next }, fn)
    }
  })
}

exports.sourceNodes = (helpers, plugin) => {
  return createSiteNode(helpers, plugin)
    .then(() => forEach(helpers, plugin, createApartmentNodes))
    .then(() => forEach(helpers, plugin, createPageNodes))
}
