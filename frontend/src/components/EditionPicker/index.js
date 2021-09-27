import React from "react"
import PropTypes from "prop-types"
import { Select } from "../FormComponents/SelectWrapper"
import { graphql, useStaticQuery } from "gatsby"

const EditionPicker = ({ value, onChange }) => {
  const data = useStaticQuery(graphql`
    query sitedata {
      allSitedataYaml {
        edges {
          node {
            id
            current_edition
            editions {
              edition
              edition_name
            }
          }
        }
      }
    }
  `)

  const sitedata = data.allSitedataYaml.edges[0].node
  const { current_edition: currentEdition, editions } = sitedata
  const editionOptions = editions.map(x => ({
    label: x.edition_name,
    value: x.edition,
  }))
  const defaultEditionOption = editionOptions.find(({ value }) => value === currentEdition )

  return (
    <Select
      css={`
        min-width: 100px;
      `}
      options={editionOptions}
      defaultValue={defaultEditionOption}
      value={value}
      onChange={x => {
        onChange(x)
      }}
    />
  )
}

EditionPicker.propTypes = {
  value: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
}

export default EditionPicker
