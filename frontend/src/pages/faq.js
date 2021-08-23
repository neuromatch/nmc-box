/* eslint-disable jsx-a11y/accessible-emoji */
import { graphql } from "gatsby"
import React from "react"
import "react-medium-image-zoom/dist/styles.css"
import styled from "styled-components"
import Layout from "../components/layout"
import { color } from "../utils"

// -- CONSTANT
// TODO: move to utils
const regex = {
  url: {
    src: "https://regexr.com/2rj36",
    pattern: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+~#?&//=]*)?/gi,
  },
  mdLink: {
    src: 'https://regexr.com/3ciio',
    pattern: /(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/gi,
  }
}

// -- FUNCTION
const composeRegex = (...regexes) => new RegExp(regexes.map(regex => regex.source).join("|"), 'g')

const componentize = text => {
  const regs = composeRegex(regex.url.pattern, regex.mdLink.pattern)
  // [matchObject] -> if there are 3 and 5 -> markdown link
  const parsed = [...text.matchAll(regs)]

  if (!parsed || parsed?.length === 0) {
    return text
  }

  const result = []
  let remainingText = text

  parsed.forEach((p, ind) => {
    const p0 = p[0]

    const start = remainingText.indexOf(p0)
    const end = start + p0.length

    result.push(remainingText.slice(0, start))

    if (p[3] && p[5]) {
      result.push(
        <a key={p[3] + p[5] + ind} href={p[5]} target="_blank" rel="noopener noreferrer">
          {p[3]}
        </a>
      )
    } else {
      if (p0.includes("@")) {
        result.push(<code key={p0 + ind}>{p0}</code>)
      } else {
        result.push(
          <a key={p0 + ind} href={p0} target="_blank" rel="noopener noreferrer">
            {p0}
          </a>
        )
      }
    }

    remainingText = remainingText.slice(end)

    if (ind === parsed.length - 1) {
      result.push(remainingText)
      remainingText = text
    }
  })

  return result
}

// -- COMPONENTS
const Section = styled.section`
  padding-bottom: 1.56rem;
`

const Details = styled.details`
  margin-bottom: 0.5rem;
`

const Summary = styled.summary`
  display: list-item;
  list-style: disclosure-closed inside;

  cursor: pointer;
`

const Tag = styled.span`
  cursor: default;
  font-size: 0.75em;

  color: ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.secondary};
  border-radius: 3px;

  padding: 1px 4px;
  margin-left: 5px;
`

const Answer = styled.p`
  background-color: ${p =>
    color.scale(p.theme.colors.primary, p.theme.colors.factor * 5)};
  border: 1px solid ${p => p.theme.colors.secondary};
  border-radius: 5px;

  margin: 5px;
  padding: 3.5px 10px;
`

// -- MAIN
export default ({ data }) => {
  const faqs = data.allFaqYaml.edges

  return (
    <Layout>
      <h2>FAQ</h2>
      <Section>
        {faqs.map(f => (
          <Details key={f.node.question + f.node.answer}>
            <Summary>
              {f.node.question}{" "}
              <b>
                <Tag>{f.node.tag}</Tag>
              </b>
            </Summary>
            <Answer>{componentize(f.node.answer)}</Answer>
          </Details>
        ))}
      </Section>
    </Layout>
  )
}

export const query = graphql`
  query {
    allFaqYaml {
      edges {
        node {
          answer
          question
          tag
        }
      }
    }
  }
`
