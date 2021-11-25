import { graphql } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"
import styled, { createGlobalStyle } from "styled-components"
import Layout from "../components/layout"
import RequiredAuthView from "../components/RequiredAuthView"
import { basedStyles } from "../styles"

const GlobalStyles = createGlobalStyle`
  ${basedStyles.simpleTableStyle}

  /* overwrite basedStyles to keep table of markdown align to the left */
  table {
    margin-left: 0;
    margin-right: 0;
  }

  div.twitter-tweet.twitter-tweet-rendered {
    margin-left: auto;
    margin-right: auto;
  }
`

const MarkdownContainer = styled.div`
  /* image style */
  img {
    border-radius: 5px;
    border: 1px solid ${p => p.theme.colors.secondary};
    padding: 3px;
    margin-top: 10px;
    width: 85%;
  }
`

const TwitterEmbedLoader = () => (
  <Helmet>
    <script
      async
      src="https://platform.twitter.com/widgets.js"
      charset="utf-8"
    ></script>
  </Helmet>
)

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  return (
    <RequiredAuthView enable={frontmatter.requiredLogin}>
      <Layout>
        <GlobalStyles />
        <h2>{frontmatter.title}</h2>
        <MarkdownContainer dangerouslySetInnerHTML={{ __html: html }} />
      </Layout>
      <TwitterEmbedLoader />
    </RequiredAuthView>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        slug
        title
        requiredLogin
      }
    }
  }
`
