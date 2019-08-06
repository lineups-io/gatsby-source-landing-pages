const createNodeHelpers = require('gatsby-node-helpers').default

const {
  createNodeFactory,
  generateTypeName,
} = createNodeHelpers({ typePrefix: 'Lineups' })

const ApartmentType = 'Apartment'
const ImageType = 'Image'
const MarketType = 'Market'
const PageType = 'Page'
const SiteType = 'Site'

exports.Types = {
  Apartment: generateTypeName(ApartmentType),
  Image: generateTypeName(ImageType),
  Market: generateTypeName(MarketType),
  Page: generateTypeName(PageType),
  Site: generateTypeName(SiteType),
}

exports.ApartmentNode = createNodeFactory(ApartmentType)
exports.ImageNode = createNodeFactory(ImageType)
exports.MarketNode = createNodeFactory(MarketType)
exports.PageNode = createNodeFactory(PageType)
exports.SiteNode = createNodeFactory(SiteType)
