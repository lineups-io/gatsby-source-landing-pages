import { graphql } from 'gatsby'

export const navFields = graphql`
  fragment NavFields on Lineups_Account {
    menu {
      title
      href
    }
    logo {
      url
    }
  }
`

export const footerFields = graphql`
  fragment FooterFields on Lineups_Account {
    title
    legalName
    icons
    Facebook: facebook
    Twitter: twitter
    Instagram: instagram
    Pinterest: pinterest
    LinkedIn: linkedIn
  }
`

