const createNodeHelpers = require('gatsby-node-helpers').default

const {
  createNodeFactory,
  generateTypeName,
} = createNodeHelpers({ typePrefix: 'Lineups' })

exports.ApartmentType = 'Apartment'
exports.ImageType = 'Image'
exports.MarketType = 'Market'
exports.PageType = 'Page'
exports.SiteType = 'Site'

exports.generateTypeName = generateTypeName

exports.ApartmentNode = createNodeFactory(ApartmentType)
exports.ImageNode = createNodeFactory(ImageType)
exports.MarketNode = createNodeFactory(MarketType)
exports.PageNode = createNodeFactory(PageType)
exports.SiteNode = createNodeFactory(SiteType)
