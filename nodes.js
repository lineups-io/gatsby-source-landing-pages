const createNodeHelpers = require('gatsby-node-helpers').default

const { createNodeFactory } = createNodeHelpers({ typePrefix: 'Lineups' })

exports.ApartmentNode = createNodeFactory('Apartment')
exports.PageNode = createNodeFactory('Page')
