import React, { useEffect, useState } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { StringParam, useQueryParams } from "use-query-params"
import AbstractDetail from "../components/AgendaComponents/AbstractDetail"
import LoadingView from "../components/BaseComponents/LoadingView"
import Layout from "../components/layout"
import useAPI from "../hooks/useAPI"
import useFirebaseWrapper from "../hooks/useFirebaseWrapper"
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
  const { timezone } = useTimezone()
  const { isLoggedIn } = useFirebaseWrapper()

  const [query] = useQueryParams({
    edition: StringParam,
    submission_id: StringParam,
  })

  const { edition, submission_id: submissionId } = query

  const [submissionData, setSubmissionData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [edition, getAbstract, submissionId])

  if (isLoading && isLoggedIn !== false) {
    return <LoadingView message="Loading.." />
  }

  return (
    <Layout>
      <GlobalStyle />
      <Container>
        {isLoggedIn === true &&
        submissionData.constructor === Object &&
        Object.keys(submissionData).length === 0 ? (
          <p
            css={`
              text-align: center;
              border: 2px solid rgb(248, 42, 96);
              padding: 12px 0;
            `}
          >
            There is no abstract with this ID.
          </p>
        ) : null}
        {isLoggedIn === false ? (
          <p
            css={`
              text-align: center;
              border: 2px solid rgb(248, 42, 96);
              padding: 12px 0;
            `}
          >
            Please register and log-in to view this abstract.
          </p>
        ) : (
          <AbstractDetail
            data={submissionData}
            timezone={timezone}
            unlimitedContentHeight
          />
        )}
      </Container>
    </Layout>
  )
}
