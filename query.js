const gql = require('graphql-tag')

exports.getSiteInfo = gql`
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

exports.getMarkets = gql`
  query getMarketsFromGatsbyPlugin ($account: ID! $offset: Int! $limit: Int!) {
    markets: findMarkets(filter: { account: $account } offset: $offset limit: $limit) {
      count
      items {
        id: publicId
        market
        submarket
        state {
          abbreviation: publicId
          name
        }

        apartments(filter: { status: published }) {
          count
          items {
            id: publicId
          }
        }

        marketPage {
          title
          shortTitle
          slug
          searchQueryParams
        }

        nonMarketPages {
          title
          shortTitle
          slug
        }

        submarkets {
          submarket

          marketPage {
            id: publicId
            title
            shortTitle
            slug
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
        adLabel
        spotlight
        name
        marketingWebsiteUrl
        prospectPhoneNumber
        address {
          line1
          city
          state
          postalCode
        }
        coordinates {
          lat
          lng
        }
        termGroups {
          name
          icon
        }
        defaultPhoto {
          id: publicId
          url
          alt
          title
        }
        markets {
          state {
             name
          }
          market
          submarket
        }
        floorPlans {
          id
          name
          marketRent {
            min
          }
          bedrooms
          bathrooms
          availability {
            unitId: UnitID
            unitRent: UnitRent
            unitDisplayRank: UnitDisplayRank
            unitDisplayStatus: UnitDisplayStatus
            dateAvailable: DateAvailable
            unitAmenityList: UnitAmenityList
            floorplan: FloorplanName
            bedrooms: UnitBedrooms
            marketRent: MarketRent
          }
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
        account {
          name
          title
        }
        breadcrumb {
          market {
            title: market
            state {
              name
            }
            marketPage {
              slug
              searchQueryParams
            }
            nonMarketPages {
              title
              shortTitle
              slug
            }
          }
          submarket {
            title: submarket
            state {
              name
            }
            marketPage {
              slug
              searchQueryParams
            }
            nonMarketPages {
              title
              shortTitle
              slug
            }
          }
          submarkets {
            title: submarket
            marketPage {
              title
              slug
              center:coordinates {
                lat
                lng
              }
              apartments(filter: { status:published }) {
                count
              }
            }
          }
        }
        id: publicId
        slug
        noindex
        h1
        copy
        title
        shortTitle
        termGroup {
          category
          name
        }
        mapZoom
        coordinates {
          lat
          lng
        }
        hideSubmarkets
        market {
          id: publicId
        }
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
