import moment from "moment-timezone"
import React, { useEffect, useState } from "react"
import styled, { createGlobalStyle } from "styled-components"
import Layout from "../components/layout"
import TimezonePicker from "../components/TimezonePicker"
import useAPI from "../hooks/useAPI"
import useTimezone from "../hooks/useTimezone"
import { basedStyles } from "../styles"
import { color } from "../utils"

// -- FUNCTIONS
const dateSorter = (a, b) => {
  if (new Date(a) === new Date(b)) {
    return 0
  }

  if (new Date(a) < new Date(b)) {
    return -1
  } else {
    return 1
  }
}

// -- COMPONENTS
const GlobalStyles = createGlobalStyle`
  ${basedStyles.simpleTableStyle}
`

const TH = styled.th`
  text-align: center;
  background-color: ${p => color.transparentize(p.theme.colors.secondary, 0.2)};
`

// -- MAIN
export default () => {
  const { getSchoolSchedule } = useAPI()
  const { timezone } = useTimezone()

  const [schedule, setSchedule] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const requestPromise = getSchoolSchedule()

    if (requestPromise) {
      requestPromise
        .then(res => res.json())
        .then(resJson => {
          // process time and groupby day
          const { data } = resJson

          const groupedBy = data.reduce((acc, cur) => {
            const { starttime } = cur
            const start = moment(starttime)
            const startDate = start.tz(timezone).format("dddd, D MMMM YYYY")

            const valOfDate = acc.find(x => x.key === startDate)

            if (valOfDate) {
              valOfDate.data.push(cur)
            } else {
              acc.push({
                key: startDate,
                data: [cur],
              })
            }

            return acc
          }, [])

          const sorted = groupedBy
            .sort((a, b) => dateSorter(a.key, b.key))
            .map(eachDay => ({
              ...eachDay,
              data: eachDay.data.sort((a, b) =>
                dateSorter(a.starttime, b.starttime)
              ),
            }))

          setSchedule(sorted)
        })
        .finally(() => setIsLoading(false))
    }
  }, [getSchoolSchedule, timezone])

  return (
    <Layout>
      <GlobalStyles />
      <h2>Table Schedule</h2>
      <p>
        You can create an API which fetch events directly
        from Airtable and show the schedule here. We
        provide an example in{' '}<code>schedule.js</code>
        {' '}where you can find how we do it.
      </p>
      <TimezonePicker />
      {!isLoading ? (
        <table>
          <thead>
            <tr css={"& > td { text-align: center; }"}>
              <td>Session</td>
              <td>Speaker</td>
              <td>Title</td>
            </tr>
          </thead>
          <tbody>
            {schedule.map(node => {
              const { key, data } = node

              return (
                <React.Fragment key={key}>
                  <tr>
                    <TH colSpan={3}>{key}</TH>
                  </tr>
                  {data.map(x => {
                    const { title, speaker, starttime, end: endtime } = x

                    const start = moment.tz(starttime, timezone).format("HH:mm")
                    const end = moment.tz(endtime, timezone).format("HH:mm")

                    return (
                      <tr key={`${start}-${end}-${speaker}-${title}`}>
                        <td>{`${start} - ${end}`}</td>
                        <td>{speaker}</td>
                        <td>{title}</td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      ) : null}
    </Layout>
  )
}
