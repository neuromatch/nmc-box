import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { common, Fa } from '../../utils';

// -- CONSTANTS
const starColor = {
  normal: '#eee',
  selected: 'orange',
  relevance: '#8cb3d9',
};

const themeLabelColors = {
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
const getColorOfTheme = (theme) => Object.entries(themeLabelColors)
  .find(([k, _]) => k === theme?.match(/Theme ([A-Z])/)?.[1])?.[1];

const getColorOfTalkFormat = (talkFormat) => talkFormatLabelColors[talkFormat];
const getTextColorOfTalkFormat = (talkFormat) => {
  if (['Keynote Event', 'Special Event'].includes(talkFormat)) {
    return '#ffffff';
  }

  return '#222222';
};

const isoToTimezone = (dtStr, tz) => moment.utc(dtStr).tz(tz).format('MMM DD, h:mm A');

// -- COMPONENTS
const Container = styled.div`
  flex: 1;
  display: flex;

  border: 1px solid #ddd;
  border-radius: 5px;

  border-left: 5px solid ${(p) => p.accent};

  padding: 5px 0;
  margin-bottom: 8px;
  margin-right: 2px;

  cursor: pointer;

  /* truncate text */
  overflow: hidden;
  /* truncate text */
`;

const FavIconContainer = styled.div`
  width: 3.5em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledFavIcon = styled(Fa).attrs(() => ({
  icon: 'star',
}))`
  cursor: pointer;
  color: ${(props) => (props.checked ? starColor.selected : starColor.normal)};
  font-size: 1.55rem !important;
  /* refer to the id of svg  */
  /* ${(props) => props.relevance && !props.checked && css`
    path {
      fill: url(#${`lgrad-${props.relevance}`});
    }
  `} */
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 7px 0;

  /* truncate text */
  overflow: hidden;
  /* truncate text */
`;

const TitleText = styled.p`
  margin: 0;
  font-size: 0.95em;

  /* to distinguise title out of other texts */
  font-family: nunito;

  /* truncate text */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  /* truncate text */
`;

const NameText = styled(TitleText)`
  font-size: 0.675em;
  font-family: 'Open Sans';
  font-style: italic;
`;

const TimeText = styled(NameText)`
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

const TrackBox = styled.div`
  display: flex;
  align-items: center;

  border: 1px solid ${(p) => p.accent};
  border-radius: 5px;
  background-color: ${(p) => `${p.accent}1A`};
  width: fit-content;

  padding: 3px 6px;
  white-space: nowrap;
`;

const TalkFormatBox = styled(TrackBox)`
  border-radius: 0;
  background-color: ${(p) => `${p.accent}`};
`;

const ThemeBox = styled(TrackBox)`
  /* truncate text */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 98%;
  /* truncate text */
`;

const TalkFormatTrackText = styled.span`
  color: ${(p) => p.accent};
  font-size: 0.675em;
  font-weight: bold;
`;

const ThemeText = styled(TalkFormatTrackText)`
  font-weight: unset;

  /* truncate text */
  text-overflow: ellipsis;
  overflow: hidden;
  /* truncate text */
`;

// -- MAIN
const AbstractListItem = ({
  data, handleClickVote, isLiked, timezone,
}) => {
  // console.log(data);

  if (!data) {
    return (
      <Container
        css={`
          justify-content: center;
          align-items: center;
        `}
      >
        <Fa icon="sync" spin />
      </Container>
    );
  }

  return (
    <Container accent={getColorOfTalkFormat(data.talk_format)}>
      <FavIconContainer
        onClick={(e) => {
          handleClickVote(data?.submission_id);
          // block this because if the item has
          // description this will propagate
          // through invoke showing description
          e.stopPropagation();
        }}
      >
        <StyledFavIcon checked={isLiked} />
      </FavIconContainer>
      <ContentContainer
        css={`
          p {
            margin: 0;
          }
        `}
      >
        <div
          css={`
            line-height: 1em;
          `}
        >
          <TitleText>{data.title}</TitleText>
          <div
            css={`
              margin-top: 3px;
            `}
          >
            {data?.fullname
              ? (
                <NameText>
                  {data?.fullname}
                  {data?.institution
                    ? `, ${data?.institution?.split(' (grid')?.[0]}`
                    : null}
                </NameText>
              )
              : null}
            <TimeText>
              <Fa icon={['far', 'clock']} />
              {` ${isoToTimezone(data?.starttime, timezone)} - ${isoToTimezone(data?.endtime, timezone)} `}
              {data?.zoom_url
                ? (
                  <ButtonAsLink
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      const isClient = typeof window === 'object';
                      if (isClient) {
                        window.open(common.decodeBase64(data?.zoom_url));
                      }
                    }}
                  >
                    [ Zoom ]
                  </ButtonAsLink>
                )
                : null}
              {data?.youtube_url
                ? (
                  <ButtonAsLink
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      const isClient = typeof window === 'object';
                      if (isClient) {
                        window.open(data?.youtube_url);
                      }
                    }}
                  >
                    [ Youtube ]
                  </ButtonAsLink>
                )
                : null}
            </TimeText>
          </div>
        </div>

        <div
          css={`
            display: flex;
            flex-direction: row;

            & > div {
              :not(:last-child) {
                margin-right: 4px;
              }
            }
          `}
        >
          <TalkFormatBox accent={getColorOfTalkFormat(data.talk_format)}>
            <TalkFormatTrackText accent={getTextColorOfTalkFormat(data.talk_format)}>
              {data.talk_format.replace(' Event', '')}
            </TalkFormatTrackText>
          </TalkFormatBox>
          {data.track
            ? (
              <TrackBox>
                <TalkFormatTrackText>
                  {data.track}
                </TalkFormatTrackText>
              </TrackBox>
            )
            : null}
          {data.theme
            ? (
              <ThemeBox accent={getColorOfTheme(data.theme)}>
                <ThemeText accent={getColorOfTheme(data.theme)}>
                  {data.theme}
                </ThemeText>
              </ThemeBox>
            )
            : null}
        </div>
      </ContentContainer>
    </Container>
  );
};

AbstractListItem.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  handleClickVote: PropTypes.func,
  isLiked: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

AbstractListItem.defaultProps = {
  data: null,
  handleClickVote: () => {},
  isLiked: false,
};

export default AbstractListItem;
