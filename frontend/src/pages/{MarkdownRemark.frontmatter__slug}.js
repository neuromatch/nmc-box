import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import styled from "styled-components"

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

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <h2>{frontmatter.title}</h2>
      <MarkdownContainer
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        slug
        title
      }
    }
  }
`
