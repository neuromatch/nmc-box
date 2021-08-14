import copy from 'copy-to-clipboard';
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment-timezone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { media, basedStyles } from '../../styles';
import Fa from '../../utils/fontawesome';
import { common } from '../../utils';
// import RequiredAuthFragment from '../RequiredAuthFragment';

// -- CONSTANTS
const labelColors = {
  A: '#666666',
  B: '#fe6a40',
  C: '#f43261',
  D: '#a479ef',
  E: '#367ff9',
  F: '#31c640',
};

const talkFormatLabelColors = {
  'Interactive talk': '#d0f0fd',
  'Traditional talk': '#d1f7c4',
  'Keynote Event': '#fcb301',
  'Special Event': '#f82a60',
};

// -- FUNCTIONS
const getColorOfTheme = (theme) => Object.entries(labelColors)
  .find(([k, _]) => k === theme?.match(/Theme ([A-Z])/)?.[1])?.[1];

const getColorOfTalkFormat = (talkFormat) => talkFormatLabelColors[talkFormat];
const getTextColorOfTalkFormat = (talkFormat) => {
  if (['Keynote Event', 'Special Event'].includes(talkFormat)) {
    return '#ffffff';
  }

  return '#222222';
};

const isoToTimezone = (dtStr, tz) => moment.utc(dtStr).tz(tz).format('MMM DD, h:mm A');

const getUrlToAddEventToCalendar = (
  starttime, endtime, title, author, abstract, isSpecialEvent,
) => {
  if ([starttime, title].some((x) => !x)) {
    console.log('this event doest not have one of [starttime, title]');
    return null;
  }

  const isoFormat = 'YYYYMMDDTHHmmss[Z]';

  const formatDateTime = (dt) => dt.format(isoFormat);

  let formattedStartTime = '';
  let formattedEndTime = '';

  // assume 15 minutes event
  if (starttime && !endtime) {
    const parsed = moment.utc(starttime);
    formattedStartTime = formatDateTime(parsed);
    formattedEndTime = formatDateTime(parsed.add(15, 'minute'));
  }
  // complete data
  if (starttime && endtime) {
    const parsedStart = moment.utc(starttime);
    const parsedEnd = moment.utc(endtime);
    formattedStartTime = formatDateTime(parsedStart);
    formattedEndTime = formatDateTime(parsedEnd);
  }

  let calendarUrl = 'https://calendar.google.com/calendar/render';
  calendarUrl += '?action=TEMPLATE';
  calendarUrl += `&dates=${formattedStartTime}`;
  calendarUrl += `/${formattedEndTime}`;
  calendarUrl += `&text=${encodeURIComponent(`[NMC 3] ${title}`)}`;

  if (isSpecialEvent) {
    if (author) {
      calendarUrl += `&details=${encodeURIComponent(`Author: ${author}\n\n${abstract || 'TBA'}`)}`;
    } else {
      calendarUrl += `&details=${encodeURIComponent(abstract || 'TBA')}`;
    }
  } else {
    calendarUrl += `&details=${encodeURIComponent(`Author: ${author}\n\nAbstract: ${abstract || 'TBA'}`)}`;
  }

  return calendarUrl;
};

// -- COMPONENTS
const TrackBox = styled.div`
  display: flex;
  align-items: center;

  border: 1px solid ${(p) => p.accent};
  border-radius: 5px;
  background-color: ${(p) => `${p.accent}1A`};
  width: fit-content;

  padding: 3px 6px;
`;

const TalkFormatBox = styled(TrackBox)`
  border-radius: 0;
  background-color: ${(p) => `${p.accent}`};
`;

const ThemeBox = styled(TrackBox)``;

const TalkFormatTrackText = styled.span`
  color: ${(p) => p.accent};
  font-size: 0.675em;
  font-weight: bold;
`;

const ThemeText = styled(TalkFormatTrackText)`
  font-weight: unset;
`;

const AbstractText = styled.p`
  font-size: 0.85em;

  white-space: pre-line;

  margin-bottom: 0;
`;

const LabelText = styled.label`
  font-weight: bold;
`;

const TitleText = styled.h3`
  font-weight: bold;

  margin-bottom: 0.85em;
`;

const AuthorText = styled.p`
  font-style: italic;
  font-size: 0.70em;
  margin: 0;

  ${(p) => p.bottomSpace && css`
    margin-bottom: 15px;
  `}
`;

const TimeText = styled(AuthorText)`
  font-style: normal;
`;

const ButtonAsLink = styled.button`
  border: none;
  background: transparent;
  outline: none;
  color: #419eda;
  cursor: pointer;
  padding: 0;

  :hover {
    color: #2a6496;
  }
`;

const ZoomLinkContainer = styled.span`
  margin-right: 6px;
`;

const ContentContainer = styled.div`
  overflow-y: auto;

  ${(p) => !p.unlimitedHeight && css`
    max-height: 40vh;
  `}

  ${basedStyles.scrollStyle}
`;

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
    zoom_url: zoomUrl,
    youtube_url: youtubeUrl,
    submission_id: submissionId,
  } = data;

  return (
    <>
      <ToastContainer
        autoClose={1250}
        hideProgressBar
        closeOnClick
        draggable
      />
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
            {talkFormat.replace(' Event', '')}
          </TalkFormatTrackText>
        </TalkFormatBox>
        {track
          ? (
            <TrackBox>
              <TalkFormatTrackText>
                {track}
              </TalkFormatTrackText>
            </TrackBox>
          )
          : null}
        {theme
          ? (
            <ThemeBox accent={getColorOfTheme(theme)}>
              <ThemeText accent={getColorOfTheme(theme)}>
                {theme}
              </ThemeText>
            </ThemeBox>
          )
          : null}
      </div>
      <TitleText>
        {title}
        &nbsp;
        <a
          href={getUrlToAddEventToCalendar(
            starttime,
            endtime,
            title,
            fullname,
            abstract,
            talkFormat === 'Special Event',
          )}
          target="_blank"
          rel="noopener noreferrer"
          css={`
            /* background-color: transparent; */
            /* border: none; */
            cursor: pointer;
            color: #333;
            outline: none;

            :hover {
              color: #333;
              opacity: 0.8;
            }

            :active {
              color: #333;
              opacity: 0.5;
            }
          `}
        >
          <Fa
            icon={['far', 'calendar-plus']}
          />
        </a>
      </TitleText>
      <ContentContainer
        unlimitedHeight={unlimitedContentHeight}
      >
        <div
          css={`
            line-height: 1em;
          `}
        >
          {fullname
            ? (
              <AuthorText>
                <LabelText>{'Author: '}</LabelText>
                {fullname}
                {institution
                  ? `, ${institution?.split(' (grid')?.[0]}`
                  : null}
              </AuthorText>
            )
            : null}
          {coauthors
            ? (
              <AuthorText>
                <LabelText>{'Coauthors: '}</LabelText>
                {coauthors}
              </AuthorText>
            )
            : null}
          <TimeText>
            <Fa icon={['far', 'clock']} />
            {` ${isoToTimezone(starttime, timezone)} - ${isoToTimezone(endtime, timezone)} `}
          </TimeText>
          <TimeText bottomSpace>
            {/* <RequiredAuthFragment> */}
            {zoomUrl
              ? (
                <ZoomLinkContainer>
                  <Fa icon="chalkboard-teacher" />
                  {' '}
                  <ButtonAsLink
                    type="button"
                    onClick={() => {
                      const isClient = typeof window === 'object';
                      if (isClient) {
                        window.open(common.decodeBase64(zoomUrl));
                      }
                    }}
                  >
                    [ Zoom ]
                  </ButtonAsLink>
                </ZoomLinkContainer>
              )
              : null}
            {/* </RequiredAuthFragment> */}
            {youtubeUrl
              ? (
                <ZoomLinkContainer>
                  <Fa icon={['fab', 'youtube']} />
                  {' '}
                  <ButtonAsLink
                    type="button"
                    onClick={() => {
                      const isClient = typeof window === 'object';
                      if (isClient) {
                        window.open(youtubeUrl);
                      }
                    }}
                  >
                    [ Youtube ]
                  </ButtonAsLink>
                </ZoomLinkContainer>
              )
              : null}
            <>
              <Fa icon="share-alt" />
              {' '}
              <ButtonAsLink
                type="button"
                onClick={() => {
                  const isClient = typeof window === 'object';
                  const url = isClient
                    ? `${window.location.origin}/abstract?submission_id=${submissionId}`
                    : `https://neuromatch.io/abstract?submission_id=${submissionId}`;

                  // copy!
                  copy(url) && toast('🦖🍞 Copied a URL! 🍞🦖');
                }}
              >
                [ Copy to share ]
              </ButtonAsLink>
            </>
          </TimeText>
        </div>
        <AbstractText>
          {talkFormat !== 'Special Event'
            ? (
              <LabelText>{'Abstract: '}</LabelText>
            )
            : null}
          {abstract || 'TBA'}
        </AbstractText>
      </ContentContainer>
    </>
  );
};

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
};

AbstractDetail.defaultProps = {
  unlimitedContentHeight: false,
};

export default AbstractDetail;
