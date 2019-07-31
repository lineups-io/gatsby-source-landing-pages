const createNodeHelpers = require('gatsby-node-helpers').default

const { createNodeFactory } = createNodeHelpers({ typePrefix: 'Lineups' })

exports.ApartmentNode = createNodeFactory('Apartment')
exports.ImageNode = createNodeFactory('Image')
exports.MarketNode = createNodeFactory('Market')
exports.PageNode = createNodeFactory('Page')
exports.SiteNode = createNodeFactory('Site')
