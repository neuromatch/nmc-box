import copy from "copy-to-clipboard"
import React from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import moment from "moment-timezone"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { media, basedStyles } from "../../styles"
import Fa from "../../utils/fontawesome"
import { common } from "../../utils"
import { talkFormatLabelColors } from "../../hooks/useDisplayEdition"
import RequiredAuthFragment from '../RequiredAuthFragment';

// -- CONSTANTS
const labelColors = {
  A: "#666666",
  B: "#fe6a40",
  C: "#f43261",
  D: "#a479ef",
  E: "#367ff9",
  F: "#31c640",
}

// -- FUNCTIONS
const getColorOfTheme = theme =>
  Object.entries(labelColors).find(
    ([k, _]) => k === theme?.match(/Theme ([A-Z])/)?.[1]
  )?.[1]

const getColorOfTalkFormat = talkFormat => talkFormatLabelColors[talkFormat]
const getTextColorOfTalkFormat = talkFormat => {
  if (["Keynote Event", "Special Event"].includes(talkFormat)) {
    return "#ffffff"
  }

  return "#222222"
}

const isoToTimezone = (dtStr, tz) =>
  moment
    .utc(dtStr)
    .tz(tz)
    .format("MMM DD, h:mm A")

const getUrlToAddEventToCalendar = (
  starttime,
  endtime,
  title,
  author,
  abstract,
  isSpecialEvent
) => {
  if ([starttime, title].some(x => !x)) {
    console.log("this event doest not have one of [starttime, title]")
    return null
  }

  const isoFormat = "YYYYMMDDTHHmmss[Z]"

  const formatDateTime = dt => dt.format(isoFormat)

  let formattedStartTime = ""
  let formattedEndTime = ""

  // assume 15 minutes event
  if (starttime && !endtime) {
    const parsed = moment.utc(starttime)
    formattedStartTime = formatDateTime(parsed)
    formattedEndTime = formatDateTime(parsed.add(15, "minute"))
  }
  // complete data
  if (starttime && endtime) {
    const parsedStart = moment.utc(starttime)
    const parsedEnd = moment.utc(endtime)
    formattedStartTime = formatDateTime(parsedStart)
    formattedEndTime = formatDateTime(parsedEnd)
  }

  let calendarUrl = "https://calendar.google.com/calendar/render"
  calendarUrl += "?action=TEMPLATE"
  calendarUrl += `&dates=${formattedStartTime}`
  calendarUrl += `/${formattedEndTime}`
  calendarUrl += `&text=${encodeURIComponent(`[NMC] ${title}`)}`

  if (isSpecialEvent) {
    if (author) {
      calendarUrl += `&details=${encodeURIComponent(
        `Author: ${author}\n\n${abstract || "TBA"}`
      )}`
    } else {
      calendarUrl += `&details=${encodeURIComponent(abstract || "TBA")}`
    }
  } else {
    calendarUrl += `&details=${encodeURIComponent(
      `Author: ${author}\n\nAbstract: ${abstract || "TBA"}`
    )}`
  }

  return calendarUrl
}

// -- COMPONENTS
const TrackBox = styled.div`
  display: flex;
  align-items: center;

  border: 1px solid ${p => p.accent || p.theme.colors.secondary};
  border-radius: 5px;
  background-color: ${p => `${p.accent}1A`};
  width: fit-content;

  padding: 3px 6px;
`

const TalkFormatBox = styled(TrackBox)`
  border-radius: 0;
  background-color: ${p => `${p.accent}`};
`

const ThemeBox = styled(TrackBox)``

const TalkFormatTrackText = styled.span`
  color: ${p => p.accent};
  font-size: 0.675em;
  font-weight: bold;
`

const ThemeText = styled(TalkFormatTrackText)`
  font-weight: unset;
`

const AbstractText = styled.p`
  font-size: 0.85em;

  white-space: pre-line;

  margin-bottom: 0;
`

const LabelText = styled.label`
  font-weight: bold;
`

const TitleText = styled.h3`
  font-weight: bold;

  margin-bottom: 0.85em;
`

const AuthorText = styled.p`
  font-style: italic;
  font-size: 0.7em;
  margin: 0;

  ${p =>
    p.bottomSpace &&
    css`
      margin-bottom: 15px;
    `}
`

const TimeText = styled(AuthorText)`
  font-style: normal;
`

const ButtonAsLink = styled.button`
  border: none;
  background: transparent;
  outline: none;
  color: ${p => p.theme.colors.accent};
  cursor: pointer;
  padding: 0;

  ${basedStyles.interxEffect}
`

const ZoomLinkContainer = styled.span`
  margin-right: 6px;
`

const ContentContainer = styled.div`
  overflow-y: auto;

  ${p =>
    !p.unlimitedHeight &&
    css`
      max-height: 40vh;
    `}

  ${basedStyles.scrollStyle}
`

// -- MAIN
const AbstractDetail = ({ data, timezone, unlimitedContentHeight }) => {
  const {
    talk_format: talkFormat,
    track,
    theme,
    title,
    starttime,
    endtime,
    fullname,
    abstract,
    institution,
    coauthors,
    edition,
    urls,
    submission_id: submissionId,
  } = data

  const addToCalendarUrl = getUrlToAddEventToCalendar(
    starttime,
    endtime,
    title,
    fullname,
    abstract,
    talkFormat === "Special Event"
  )

  return (
    <>
      <ToastContainer autoClose={1250} hideProgressBar closeOnClick draggable />
      <div
        css={`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin-bottom: 0.75em;

          & > div {
            :not(:last-child) {
              margin-right: 4px;
            }

            ${media.small`
              :last-child {
                margin-top: 4px;
              }
            `}
          }
        `}
      >
        <TalkFormatBox accent={getColorOfTalkFormat(talkFormat)}>
          <TalkFormatTrackText accent={getTextColorOfTalkFormat(talkFormat)}>
            {talkFormat?.replace(" Event", "") || talkFormat}
          </TalkFormatTrackText>
        </TalkFormatBox>
        {track ? (
          <TrackBox>
            <TalkFormatTrackText>{track}</TalkFormatTrackText>
          </TrackBox>
        ) : null}
        {theme ? (
          <ThemeBox accent={getColorOfTheme(theme)}>
            <ThemeText accent={getColorOfTheme(theme)}>{theme}</ThemeText>
          </ThemeBox>
        ) : null}
      </div>
      <TitleText>
        {title}
        {addToCalendarUrl ? (
          <>
            &nbsp;
            <a
              href={addToCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              css={`
                /* background-color: transparent; */
                /* border: none; */
                cursor: pointer;
                outline: none;

                ${basedStyles.interxEffect}
              `}
            >
              <Fa icon={["far", "calendar-plus"]} />
            </a>
          </>
        ) : null}
      </TitleText>
      <ContentContainer unlimitedHeight={unlimitedContentHeight}>
        <div
          css={`
            line-height: 1em;
          `}
        >
          {fullname ? (
            <AuthorText>
              <LabelText>{"Author: "}</LabelText>
              {fullname}
              {institution ? `, ${institution?.split(" (grid")?.[0]}` : null}
            </AuthorText>
          ) : null}
          {coauthors ? (
            <AuthorText>
              <LabelText>{"Coauthors: "}</LabelText>
              {coauthors}
            </AuthorText>
          ) : null}
          {starttime ? (
            <TimeText>
              <Fa icon={["far", "clock"]} />
              {` ${isoToTimezone(starttime, timezone)} - ${isoToTimezone(
                endtime,
                timezone
              )} `}
            </TimeText>
          ) : null}
          <TimeText bottomSpace>
            {urls ? urls.map(({ name, url }) => (
              <RequiredAuthFragment
                key={`${name}+${url}`}
                enable={name.toLowerCase().includes("zoom")}
              >
                <ZoomLinkContainer>
                  <Fa icon="chalkboard-teacher" />{" "}
                  <ButtonAsLink
                    type="button"
                    onClick={() => {
                      const isClient = typeof window === "object"
                      if (isClient) {
                        window.open(common.decodeBase64(url))
                      }
                    }}
                  >
                    [ {name} ]
                  </ButtonAsLink>
                </ZoomLinkContainer>
              </RequiredAuthFragment>
            )) : null}
            <>
              <Fa icon="share-alt" />{" "}
              <ButtonAsLink
                type="button"
                onClick={() => {
                  const isClient = typeof window === "object"
                  const url = isClient
                    ? `${window.location.origin}/abstract?edition=${edition}&submission_id=${submissionId}`
                    : `/abstract?edition=${edition}&submission_id=${submissionId}`

                  // copy!
                  copy(url) && toast("🦖🍞 Copied a URL! 🍞🦖")
                }}
              >
                [ Copy to share ]
              </ButtonAsLink>
            </>
          </TimeText>
        </div>
        <AbstractText>
          {talkFormat !== "Special Event" ? (
            <LabelText>{"Abstract: "}</LabelText>
          ) : null}
          {abstract || "TBA"}
        </AbstractText>
      </ContentContainer>
    </>
  )
}

AbstractDetail.propTypes = {
  data: PropTypes.shape({
    talk_format: PropTypes.string,
    track: PropTypes.string,
    theme: PropTypes.string,
    title: PropTypes.string,
    starttime: PropTypes.string,
    endtime: PropTypes.string,
    fullname: PropTypes.string,
    abstract: PropTypes.string,
    institution: PropTypes.string,
    coauthors: PropTypes.string,
    zoom_url: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
  unlimitedContentHeight: PropTypes.bool,
}

AbstractDetail.defaultProps = {
  unlimitedContentHeight: false,
}

export default AbstractDetail
