const gql = require('graphql-tag')

exports.getSiteInfo = gql`
  query getSiteInfoFromGatsbyPlugin ($account: ID!) {
    site: getAccountById(id: $account) {
      id: publicId
      name
      title
      menu {
        title
        href
      }
      webfonts
      logo {
        url
      }
      footer {
        copyrightOwner
        icons
        social {
          icon
          href
          fontAwesome
        }
        menu {
          title
          href
          subMenu {
            title
            href
            markdown
          }
        }
      }
    }
  }
`

exports.getApartments = gql`
  query getApartmentsFromGatsbyPlugin ($account: ID! $offset: Int! $limit: Int!) {
    apartments: findApartments(filter: { account: $account status:published } offset: $offset limit: $limit) {
      count
      items {
        id: publicId
        name
        enabledFeatures
        marketingWebsiteUrl
        floorPlanUrl
        realPage {
          siteId
          wid
        }
        defaultPhoto {
          url
        }
      }
    }
  }
`

exports.getPages = gql`
  query getPagesFromGatsbyPlugin ($account: ID! $offset: Int! $limit: Int!) {
    pages: findPages(filter: { account: $account status:published } offset: $offset limit: $limit) {
      count
      items {
        id: publicId
        slug
        noindex
        apartments(filter: { status:published }) {
          count
          items {
            id: publicId
          }
        }
      }
    }
  }
`
