/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import Fa from '../../utils/fontawesome';
import { media, Mixins } from '../../utils/ui';
import RequiredAuthFragment from '../RequiredAuthFragment';

// -- FUNCTIONS
// https://codegolf.stackexchange.com/a/71616
// charAt(): https://stackoverflow.com/a/54827850/4010864
const capitalAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// -- COMPONENTS
const BoldText = styled.span`
  font-weight: bold;
`;

const StyledTable = styled.table`
  ${media.small`
    /* this allows only table scroll in smallscreen */
    display: block;
    overflow-x: scroll;

    /* grow over parent's padding in small screen */
    ${Mixins.growOverParentPadding(96)}
  `}

  th {
    border: none;
    padding-left: 0em;

    h4 {
      margin: 0;
    }
  }

  tr {
    :not(:nth-child(odd)) {
      background-color: #f4f4f4;
    }

    td {
      border: none;

      /* control column width */
      &:nth-child(1) {
        width: 140px;
      }

      &:nth-child(3) {
        width: 160px;
      }

      &:nth-child(2) {
        min-width: 460px;
      }

      /* padding is removed in layout */
      &:first-child {
        padding-left: 1em;
      }

      &:last-child {
        padding-right: 1em;
      }
    }
  }
`;

const StyledExpandable = styled.div`
  cursor: pointer;

  &:focus {
    outline: none;
  }

  h4,
  p {
    margin: 0;
  }

  p {
    font-size: 0.75em;
    line-height: 1.5em;

    &.title {
      font-size: 1em;
      font-style: italic;
      margin: 0.5em 0 0.25em;
    }

    &.bold,
    .bold {
      font-weight: bold;
    }

    &.enlarged,
    .enlarged {
      font-size: 110%;
      text-decoration: underline;
    }

    .contributed-speaker {
      font-weight: normal;
      font-style: normal;
    }

    .shorttalk-title {
      font-weight: bold;
      font-style: italic;
    }

    &.abstract-content,
    .abstract-content {
      white-space: pre-line;
    }
  }

  ul li,
  ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  hr {
    margin: 1.25em 1em;
    background-color: #ccc;
  }
`;

const ExpandableSpeaker = ({ title, abstract, speaker }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledExpandable
      role="button"
      onClick={() => setExpanded(!expanded)}
      onKeyPress={() => setExpanded(!expanded)}
      tabIndex={0}
    >
      {speaker}
      &nbsp;
      {expanded ? <Fa icon="caret-up" /> : <Fa icon="caret-down" />}
      {expanded ? (
        <>
          <p className="bold title">{title}</p>
          <p className="abstract-content">
            {abstract ? (
              <>
                <span className="bold">Abstract:</span>
                {' '}
                {abstract}
              </>
            ) : null}
          </p>
        </>
      ) : null}
    </StyledExpandable>
  );
};

/**
 * A component to render short talks
 * @param {object} props props
 * @param {string} props.title talk title, this is actually from speaker field of the data
 * @param {object[]=} props.contributedTalkData this is an array of object ([{}])
 * @param {string=} props.optionalAbstract optional abstract for special talk type
 * @param {string=} props.optionalTitle optional title, this is the actual title of the data
 */
const ExpandableContributedTalks = ({
  title, contributedTalkData, optionalAbstract, optionalTitle,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledExpandable
      role="button"
      onClick={() => setExpanded(!expanded)}
      onKeyPress={() => setExpanded(!expanded)}
      tabIndex={0}
    >
      {title}
      &nbsp;
      {expanded ? <Fa icon="caret-up" /> : <Fa icon="caret-down" />}
      {expanded && (optionalTitle || optionalAbstract)
        ? (
          <>
            <p className="bold title enlarged">
              {optionalTitle}
            </p>
            <p className="abstract-content">
              {optionalAbstract ? (
                <>
                  {optionalAbstract}
                </>
              ) : null}
            </p>
            <hr />
          </>
        )
        : null}
      {expanded
        ? contributedTalkData.map((slotData) => (
          <React.Fragment key={slotData.title}>
            <p className="bold title">
              {slotData.speaker ? (
                <>
                  <span className="contributed-speaker">
                    {slotData.speaker}
                  </span>
                  <br />
                </>
              ) : null}
              {slotData.title}
            </p>
            <p className="abstract-content">
              {slotData.abstract ? (
                <>
                  <span className="bold">Abstract:</span>
                  {' '}
                  {slotData.abstract}
                </>
              ) : null}
            </p>
          </React.Fragment>
        ))
        : null}
    </StyledExpandable>
  );
};

/**
 * A component to render short talks
 * @param {object} props props
 * @param {string} props.title talk title
 * @param {object[]=} props.shortTalkData this is an array of array of object ([[{}]])
 */
const ExpandableShortTalks = ({ title, shortTalkData }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledExpandable
      role="button"
      onClick={() => setExpanded(!expanded)}
      onKeyPress={() => setExpanded(!expanded)}
      tabIndex={0}
    >
      {title}
      &nbsp;
      {expanded ? <Fa icon="caret-up" /> : <Fa icon="caret-down" />}
      {expanded
        ? shortTalkData.map((parallelData, ind) => (
          <React.Fragment key={Math.random().toString()}>
            <p className="bold title">
              Parallel
              {` ${capitalAlphabet.charAt(ind)}`}
            </p>
            {parallelData.length === 0 ? (
              <p>No talks in this session.</p>
            ) : null}
            <ul>
              {parallelData.map((slotData) => (
                <li key={slotData.title}>
                  <p>
                    <span className="shorttalk-title">{slotData.title}</span>
                    {slotData.speaker ? (
                      <>
                        {' '}
                        -
                        {` ${slotData.speaker}`}
                      </>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))
        : null}
    </StyledExpandable>
  );
};

/**
 * A component to handler talk
 * @param {object} props props
 * @param {string} props.speaker speaker name
 * @param {string=} props.title title of the talk
 * @param {string=} props.abstract abstract of the talk
 * @param {object[]=} props.schedule schedule for contributed/short talks if there is
 */
const TalkHandler = ({
  schedule, speaker, title, abstract,
}) => {
  if (schedule && schedule.length > 0) {
    // contributed talks has no parallel
    if (schedule.length === 1) {
      return (
        <ExpandableContributedTalks
          title={speaker}
          contributedTalkData={schedule[0]}
          optionalTitle={title}
          optionalAbstract={abstract}
        />
      );
    }

    // short talks must have more than 1 track
    return <ExpandableShortTalks title={speaker} shortTalkData={schedule} />;
  }

  if (title || abstract) {
    return (
      <ExpandableSpeaker title={title} speaker={speaker} abstract={abstract} />
    );
  }

  return <>{speaker}</>;
};

/**
 * A component to handler talk
 * @param {object} props props
 * @param {object} props.talkFormats talk format either array or object
 */
const TalkFormatHandler = ({ talkFormats }) => {
  if (Array.isArray(talkFormats) && talkFormats.length > 0) {
    return (
      <>
        {talkFormats.map((eachFormat) => (
          <React.Fragment key={eachFormat.name}>
            {
              ['crowdcast', 'posters']
                .some((x) => eachFormat.url.toLowerCase().includes(x))
                ? (
                  <>
                    <a href={eachFormat.url} target="_blank" rel="noopener noreferrer">
                      {eachFormat.name}
                    </a>
                    <br />
                  </>
                )
                : (
                  <RequiredAuthFragment>
                    <a href={eachFormat.url} target="_blank" rel="noopener noreferrer">
                      {eachFormat.name}
                    </a>
                    <br />
                  </RequiredAuthFragment>
                )
            }
          </React.Fragment>
        ))}
      </>
    );
  }

  return '-';
};

const AgendaInADay = ({ date, data }) => (
  <>
    <thead>
      <tr>
        <th colSpan={4}>
          <h4>{date}</h4>
        </th>
      </tr>
    </thead>
    <tbody>
      {/* color cheating */}
      <tr />
      <tr>
        <td>
          <BoldText>Time</BoldText>
        </td>
        <td>
          <BoldText>Speakers</BoldText>
        </td>
        <td>
          <BoldText>Talk format</BoldText>
        </td>
      </tr>
      {data.map((x) => (
        <tr key={`${x.speaker}-${date}-${x.datetime_edt}`}>
          <td valign="top">
            {x.tzTime}
          </td>
          <td valign="top">
            <TalkHandler
              schedule={x.schedule}
              speaker={x.speaker}
              title={x.title}
              abstract={x.abstract}
            />
          </td>
          <td valign="top">
            <TalkFormatHandler talkFormats={x.talk_format} />
          </td>
        </tr>
      ))}
    </tbody>
  </>
);

export { StyledTable, AgendaInADay };
