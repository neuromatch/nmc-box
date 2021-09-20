import React, { useState } from "react"
import PropTypes from "prop-types"
import { Select } from "../FormComponents/SelectWrapper"
import { graphql, useStaticQuery } from "gatsby"

const EditionPicker = ({ onChange }) => {
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

  const [displayEdition, setDisplayEdition] = useState(defaultEditionOption)

  return (
    <Select
      css={`
        min-width: 100px;
      `}
      options={editionOptions}
      defaultValue={displayEdition}
      components={{
        IndicatorSeparator: () => null,
      }}
      onChange={x => {
        setDisplayEdition(x)
        onChange(x)
      }}
    />
  )
}

EditionPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default EditionPicker
