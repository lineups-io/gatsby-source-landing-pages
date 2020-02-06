import gql from 'graphql-tag'

export const getSiteInfo = gql`
  query getSiteInfoFromGatsbyPlugin ($account: ID!) {
    site: getAccountById(id: $account) {
      id: publicId
      name
      title
      legalName
      menu {
        title
        href
      }
      icons
      privacyPolicy
      termsOfUse
      websiteDisclaimer
      cookiePolicy
      facebook
      twitter
      instagram
      pinterest
      linkedIn
      webfonts
      logo {
        url
      }
    }
  }
`

export const getApartments = gql`
  query getApartmentsFromGatsbyPlugin ($account: ID! $offset: Int! $limit: Int!) {
    apartments: findApartments(filter: { account: $account status:published } offset: $offset limit: $limit) {
      count
      items {
        id: publicId
        defaultPhoto {
          url
        }
      }
    }
  }
`

export const getPages = gql`
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
