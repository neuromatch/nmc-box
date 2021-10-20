import React, { useEffect, useState } from "react"
import styled, { createGlobalStyle } from "styled-components"
import AbstractDetail from "../components/AgendaComponents/AbstractDetail"
import LoadingView from "../components/BaseComponents/LoadingView"
import Layout from "../components/layout"
import useAPI from "../hooks/useAPI"
import { useQueryParams, StringParam } from "use-query-params"
import useTimezone from "../hooks/useTimezone"
import { basedStyles } from "../styles"

// URL => /abstract?edition={editionId}&submission_id={abstractId} -> display abstract details (the same with the popup)

// -- COMPONENTS
const GlobalStyle = createGlobalStyle`
  body {
    ${basedStyles.scrollStyle}
  }
`

const Container = styled.div`
  margin-bottom: 2em;
`

export default () => {
  const { getAbstract } = useAPI()

  const [submissionData, setSubmissionData] = useState({})
  const { timezone } = useTimezone()

  const [query] = useQueryParams({
    edition: StringParam,
    submission_id: StringParam,
  })

  const { edition, submission_id: submissionId } = query

  useEffect(() => {
    if (!submissionId || !edition) {
      return
    }

    const requestPromise = getAbstract({ edition, submissionId })

    if (requestPromise) {
      requestPromise
        .then(res => res.json())
        .then(resJson => {
          setSubmissionData(resJson.data)
        })
        .finally(() => {})
    }
  }, [edition, getAbstract, submissionId])

  if (
    submissionData.constructor === Object &&
    Object.keys(submissionData).length === 0
  ) {
    return <LoadingView message="Loading.." />
  }

  return (
    <Layout>
      <GlobalStyle />
      <Container>
        <AbstractDetail
          data={submissionData}
          timezone={timezone}
          unlimitedContentHeight
        />
      </Container>
    </Layout>
  )
}
