/* eslint-disable jsx-a11y/accessible-emoji */
import { debounce } from 'lodash/function';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { AutoSizer } from 'react-virtualized';
import styled, { createGlobalStyle } from 'styled-components';
import { ButtonsContainer, LineButton, ToggleLineButton } from '../components/BaseComponents/Buttons';
import CommonPageStyles from '../components/BaseComponents/CommonPageStyles';
import HeadingWithButtonContainer from '../components/BaseComponents/HeadingWithButtonContainer';
import LoadingView from '../components/BaseComponents/LoadingView';
import Layout from '../components/layout';
import TimezonePicker from '../components/TimezonePicker';
import { useAuthenFetchGet } from '../hooks/useFetch';
import useTimezone, { timezoneParser } from '../hooks/useTimezone';
import useValidateRegistration from '../hooks/useValidateRegistration';
import { basedStyles, growOverParentPadding, media } from '../styles';
import Fa from '../utils/fontawesome';
import AbstractModal from '../components/AbstractBrowser/AbstractModal';
import AbstractVirtualizedList from '../components/AbstractBrowser/AbstractVirtualizedList';

// -- TYPES
/**
 * @typedef SubmissionDataObj
 * @property {string} abstract
 * @property {string} coauthors
 * @property {string} email
 * @property {string} endtime
 * @property {string} fullname
 * @property {string} institution
 * @property {string} starttime
 * @property {string} submission_id
 * @property {string} talk_format
 * @property {string} theme
 */

// -- FUNCTIONS
const selectedDatetimeToISO = (dtStr, tz) => {
  // remove timezone from new Date()
  const pureDt = dtStr.toString().split(' GMT')?.[0];
  const momentObj = moment.tz(pureDt, 'ddd MMM DD YYYY HH:mm:ss', tz);

  return momentObj.toISOString();
};

const fetchSubmissions = (
  fetchUrl,
  idToken,
  setLoading,
  setIsFlushing,
  setSubmissionData,
  setSubmissionMeta,
  setSubmissionLinks,
) => {
  // -- flush list and display loading indicator
  setIsFlushing(true);
  setLoading(true);

  // fetch(fetchUrl,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${idToken}`,
  //     },
  //   })
  //   .then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }

  //     console.log('err', res);

  //     return {
  //       data: [],
  //       meta: {},
  //       links: {},
  //     };
  //   })
  //   .then(({ data, meta, links }) => {
  //     setSubmissionData(data);
  //     setSubmissionMeta(meta);
  //     setSubmissionLinks(links);
  //   })
  //   .finally(() => {
  //     setLoading(false);
  //     setIsFlushing(false);
  //   });
};

// -- CONSTANTS
const timeBoundary = [
  timezoneParser('October 26, 2020 00:00', 'UTC').toISOString(),
  timezoneParser('October 31, 2020 12:00', 'UTC').toISOString(),
];

const utcStartTime = moment.utc(timeBoundary[0]);
const utcEndTime = moment.utc(timeBoundary[1]);

// -- COMPONENTS
const GlobalStyle = createGlobalStyle`
  body {
    ${basedStyles.scrollStyle}
  }
`;

const ListContainer = styled.div`
  flex: 1;
  margin-bottom: 1.56em;

  .virtualized-list {
    :active, :focus {
      outline: none;
    }
  }

  ${media.extraSmall`
    ${growOverParentPadding(99)}
  `}
`;

const TableControlContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.75em;
`;

const ViewButtonsContainer = styled(ButtonsContainer)`
  display: flex;
  flex: 1;
  /* wrap so that buttons are pushed to the next line in small screen */
  flex-wrap: wrap;
  justify-content: center;

  /* override */
  margin-top: 0;
  padding: 0;

  /* buttons container have to be flex to prevent button wrapped as multi-line  */
  div {
    display: flex;
  }
`;

const ViewButton = styled(ToggleLineButton).attrs(() => ({
  color: '#333',
  hoverColor: '#fff',
  hoverBgColor: '#444',
}))`
  font-size: 0.85em;

  ${media.extraSmall`
    font-size: 0.765em;
    padding: 4px 6px;
  `}
`;

const SearchBoxContainer = styled.div`
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;

  ${media.small`
    /* this get wrapped in small screen so need margin */
    margin-top: 1.25em;
  `}
`;

const StyledSearchInput = styled.input`
  outline: none;
  min-width: 225px;
  width: 50%;
  padding: 0 5px;
  border: none;
  border-bottom: 2px solid #333;

  :active, :focus {
    outline: none;
  }

  ${media.small`
    width: 100%;
  `}
`;

const NoResultText = styled.p`
  text-align: center;
`;

const CustomDatetimePickerInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <LineButton
    css={`
      font-size: 0.8rem;
      padding: 3px 6px;
    `}
    color="#333"
    onClick={onClick}
  >
    {value || placeholder}
  </LineButton>
));

CustomDatetimePickerInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
};

CustomDatetimePickerInput.defaultProps = {
  value: null,
  onClick: () => {},
  placeholder: null,
};

const DatePickersContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  span {
    font-size: 0.75em;
  }

  /* https://github.com/Hacker0x01/react-datepicker/issues/624#issuecomment-403012034 */
  .react-datepicker { font-size: 1em !important }
  .react-datepicker__header { padding-top: 0.8em !important}
  .react-datepicker__month { margin: 0.4em 1em !important}
  .react-datepicker__day-name, .react-datepicker__day {
    width: 1.9em !important;
    line-height: 1.9em !important;
    margin: 0.166em !important;
  }
  .react-datepicker__current-month { font-size: 1em !important }
  .react-datepicker__navigation {
    top: 1em !important;
    line-height: 1.7em !important;
    border: 0.45em solid transparent !important;
  }
  .react-datepicker__navigation--previous { border-right-color: #ccc !important; left: 1em !important }
  .react-datepicker__navigation--next {
    border-left-color: #ccc !important;
    right: 1em !important;
    left: 220px !important
  }
  .react-datepicker__time-container { width: 6em !important}
  .react-datepicker-time__header { font-size: 1em !important }
  .react-datepicker-time__header--time { padding-left: 0px !important; padding-right: 0px !important }
  .react-datepicker__time-box {
    margin-left: 0px !important;
    margin-right: 0px !important;
    width:100% !important
  }
  .react-datepicker__time-list { padding: 0 !important; }
`;

// -- MAIN
export default () => {
  // idToken is for debounce fetch for search
  const { isLoggedIn, idToken } = useValidateRegistration();

  // state for holding current view 'default', 'your-votes', 'recommendations', 'personalized'
  const [currentView, setCurrentView] = useState('default');
  // states for data pagination
  /** This is for autocompletion
   * @type {[SubmissionDataObj[], function]} SubmissionData
   */
  const [submissionData, setSubmissionData] = useState([]);
  const [submissionMeta, setSubmissionMeta] = useState({});
  const [submissionLinks, setSubmissionLinks] = useState({});
  // this is true when fetching and false when done fetching
  const [loading, setLoading] = useState(true);
  // modal visibility status and data to be displayed on modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pressedItemData, setPressedItemData] = useState(null);
  // this is used to force update infinited list to prevent crash
  const [isFlushing, setIsFlushing] = useState(false);
  // -- preferences both local and remote
  const [myPreferences, setMyPreferences] = useState([]);
  const { result: preferences } = useAuthenFetchGet(
    '/api/preference',
    [],
  );
  // -- date time picker filter
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const { timezone, setTimezone } = useTimezone();
  // -- sort checkbox
  // eslint-disable-next-line no-unused-vars
  const [sortBy, setSortBy] = useState('relevance');
  // -- query string
  const [queryString, setQueryString] = useState('');
  const searchInputRef = useRef(null);

  // fetch my preferences from remote and update my preferences locally
  useEffect(() => {
    setMyPreferences(preferences);
  }, [preferences]);
  // -- preferences both local and remote

  const debounceInputQuery = useCallback(
    debounce((inputText) => {
      setQueryString(inputText);
    }, 1000),
    [],
  );
  // -- debounce fetch for search

  useEffect(() => {
    if (!idToken) {
      return;
    }

    if (queryString) {
      // -- prevent re-fetch only by either start or end time
      if ((startDateTime && !endDateTime) || (!startDateTime && endDateTime)) {
        return;
      }

      // -- move to default view
      setCurrentView('default');

      let fetchUrl = `/api/abstract?view=default&query=${encodeURI(queryString)}`;

      if (startDateTime && endDateTime) {
        fetchUrl += `&starttime=${encodeURIComponent(selectedDatetimeToISO(startDateTime, timezone))}&endtime=${encodeURIComponent(selectedDatetimeToISO(endDateTime, timezone))}`;
      }

      // switch (sortBy) {
      //   case 'time':
      //     fetchUrl += '&sort=true';
      //     break;
      //   default:
      //     fetchUrl += '&sort=false';
      //     break;
      // }

      // start fetching
      fetchSubmissions(
        fetchUrl,
        idToken,
        setLoading,
        setIsFlushing,
        setSubmissionData,
        setSubmissionMeta,
        setSubmissionLinks,
      );
    }

    // a block to handle a case where queryString is ''
    // and currentView is 'default'
    if (currentView === 'default' && queryString === '') {
      // -- prevent re-fetch only by either start or end time
      if ((startDateTime && !endDateTime) || (!startDateTime && endDateTime)) {
        return;
      }

      let fetchUrl = '/api/abstract?view=default';

      if (startDateTime && endDateTime) {
        fetchUrl += `&starttime=${encodeURIComponent(selectedDatetimeToISO(startDateTime, timezone))}&endtime=${encodeURIComponent(selectedDatetimeToISO(endDateTime, timezone))}`;
      }

      // start fetching
      fetchSubmissions(
        fetchUrl,
        idToken,
        setLoading,
        setIsFlushing,
        setSubmissionData,
        setSubmissionMeta,
        setSubmissionLinks,
      );
    }
  }, [idToken, endDateTime, queryString, startDateTime]);

  useEffect(() => {
    // -- handle special case, stop this effect when there is queryString and in default view
    if (currentView === 'default' && queryString !== '') {
      return;
    }
    // -- prevent re-fetch only by either start or end time
    if ((startDateTime && !endDateTime) || (!startDateTime && endDateTime)) {
      return;
    }

    // fetch once and update those 3 state;
    if (idToken) {
      let fetchUrl = `/api/abstract?view=${currentView}`;

      // your-votes is always sorted
      if (currentView === 'your-votes') {
        fetchUrl += '&sort=true';
      }

      if (startDateTime && endDateTime) {
        fetchUrl += `&starttime=${encodeURIComponent(selectedDatetimeToISO(startDateTime, timezone))}&endtime=${encodeURIComponent(selectedDatetimeToISO(endDateTime, timezone))}`;
      }

      // switch (sortBy) {
      //   case 'time':
      //     fetchUrl += '&sort=true';
      //     break;
      //   default:
      //     fetchUrl += '&sort=false';
      //     break;
      // }

      // start fetching
      fetchSubmissions(
        fetchUrl,
        idToken,
        setLoading,
        setIsFlushing,
        setSubmissionData,
        setSubmissionMeta,
        setSubmissionLinks,
      );
    }
  }, [idToken, currentView, startDateTime, endDateTime]);

  const { currentPage, totalPage } = submissionMeta;
  const { next } = submissionLinks;

  return (
    <Layout containerStyle="display: flex; flex: 1;">
      <GlobalStyle />
      <AbstractModal
        data={pressedItemData}
        visible={detailModalVisible}
        handleClickClose={() => setDetailModalVisible(false)}
        timezone={timezone}
      />
      <CommonPageStyles
        css={`
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-bottom: 0;
        `}
      >
        <HeadingWithButtonContainer
          css={`
          ${media.medium`
            display: block;

            h2 {
              margin-bottom: 0.5em;
            }
          `}
        `}
        >
          <h2>Abstract Browser</h2>
          <TimezonePicker
            currentTimezone={timezone}
            onChange={(tz) => {
              setTimezone(tz);
            }}
          />
        </HeadingWithButtonContainer>
        <ul>
          <li>
            Please vote for abstracts that you would like to see.
            {' '}
            <b>
              You can click the star button to vote.
            </b>
            {' '}
            You only see title and abstract of the submission
            in the voting period to reduce bias.
            {' '}
            <b>
              Click the card to expand the details.
            </b>
            {' '}
            We will use your votes to optimize overall the schedule
            of the conference and you can vote as many submissions
            as you like.  You need to vote for at least one abstract.
          </li>
          <li>
            <b>The Recommendations button</b>
            {' '}
            will return a list of the abstracts
            most relevant to you based on
            {' '}
            <b>Your votes</b>
            .
          </li>
          <li>
            <b>The Personalized button</b>
            {' '}
            will return personalized abstracts through out the
            conference for you.
          </li>
          <li>
            You can return here as many times as you like to change your
            votes.
          </li>
          <li>
            You can also change your preferred timezone on the top right
            and filter your results using
            {' '}
            <b>From</b>
            {' '}
            and
            {' '}
            <b>To</b>
            {' '}
            box. We display using 12 hour format with AM/PM.
          </li>
          <li>
            {'If you want to add an abstract to your Google calendar, you can expand the card and click '}
            <Fa icon={['far', 'calendar-plus']} />
            {' located behind the title.'}
          </li>
        </ul>
        {isLoggedIn
          ? (
            <>
              <TableControlContainer>
                <SearchBoxContainer>
                  <Fa css="margin-right: 8px;" icon="search" />
                  <StyledSearchInput
                    ref={searchInputRef}
                    type="text"
                    placeholder="search here"
                    onChange={(e) => debounceInputQuery(e.target.value)}
                  />
                </SearchBoxContainer>
              </TableControlContainer>
              <TableControlContainer>
                <ViewButtonsContainer>
                  <ViewButton
                    active={currentView === 'personalized'}
                    onClick={() => {
                      setCurrentView('personalized');
                      setQueryString('');
                      searchInputRef.current.value = '';
                    }}
                  >
                    Personalized
                  </ViewButton>
                  <ViewButton
                    active={currentView === 'default'}
                    onClick={() => {
                      setCurrentView('default');
                      setQueryString('');
                      searchInputRef.current.value = '';
                    }}
                  >
                    Explorer
                  </ViewButton>
                  <ViewButton
                    active={currentView === 'your-votes'}
                    onClick={() => {
                      setCurrentView('your-votes');
                      setQueryString('');
                      searchInputRef.current.value = '';
                    }}
                  >
                    Your votes
                  </ViewButton>
                  <ViewButton
                    active={currentView === 'recommendations'}
                    onClick={() => {
                      setCurrentView('recommendations');
                      setQueryString('');
                      searchInputRef.current.value = '';
                    }}
                  >
                    Recommendations
                  </ViewButton>
                </ViewButtonsContainer>
              </TableControlContainer>
              <TableControlContainer
                css={`
                  justify-content: center;
                  align-items: center;
                `}
              >
                <DatePickersContainer>
                  <span>From: </span>
                  <DatePicker
                    isClearable
                    withPortal
                    selected={startDateTime}
                    onChange={(date) => setStartDateTime(date)}
                    minDate={new Date(utcStartTime.clone().tz(timezone).format('MMM-DD-yyyy HH:mm'))}
                    maxDate={new Date(utcEndTime.clone().tz(timezone).format('MMM-DD-yyyy HH:mm'))}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    customInput={<CustomDatetimePickerInput />}
                    placeholderText="start date time"
                  />
                  &nbsp;
                  <span>To: </span>
                  <DatePicker
                    isClearable
                    withPortal
                    selected={endDateTime}
                    onChange={(date) => setEndDateTime(date)}
                    minDate={new Date(utcStartTime.clone().tz(timezone).format('MMM-DD-yyyy HH:mm'))}
                    maxDate={new Date(utcEndTime.clone().tz(timezone).format('MMM-DD-yyyy HH:mm'))}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    customInput={<CustomDatetimePickerInput />}
                    placeholderText="end date time"
                  />
                  &nbsp;
                </DatePickersContainer>
                {false && (currentView === 'default' || currentView === 'recommendations')
                  ? (
                    <div
                      css={`
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;

                        span {
                          font-size: 0.75em;
                        }
                      `}
                    >
                      <span>Sort by:&nbsp;</span>
                      <Select
                        css={`
                          min-width: 140px;
                          font-size: 0.8rem;
                        `}
                        defaultValue={{ label: 'Relevance', value: 'relevance' }}
                        isSearchable={false}
                        name="filter"
                        options={[
                          { label: 'Relevance', value: 'relevance' },
                          { label: 'Time', value: 'time' },
                        ]}
                        onChange={(opt) => setSortBy(opt?.value)}
                      />
                    </div>
                  )
                  : null}
              </TableControlContainer>
              <ListContainer>
                {
                  loading
                    ? (
                      <LoadingView growInFlex />
                    )
                    : submissionData?.length > 0
                      ? (
                        <AutoSizer disableHeight>
                          {({ width }) => (
                            <AbstractVirtualizedList
                              flushing={isFlushing}
                              onPressItem={(pressedInd) => {
                                // trigger modal
                                setDetailModalVisible(true);
                                setPressedItemData(submissionData?.[pressedInd]);
                              }}
                              parentWidth={width}
                              hasNextPage={currentPage < totalPage}
                              isNextPageLoading={loading}
                              list={submissionData}
                              loadNextPage={() => {
                                // dont set loading true here because we dont' want LoadingView
                                if (next && idToken) {
                                  fetch(next,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${idToken}`,
                                      },
                                    })
                                    .then((res) => res.json())
                                    .then(({ data, meta, links }) => {
                                      setSubmissionData([...submissionData, ...data]);
                                      setSubmissionMeta(meta);
                                      setSubmissionLinks(links);
                                    }).finally(() => {
                                      setLoading(false);
                                    });
                                }
                              }}
                              handleClickVote={(submissionId) => {
                                const action = myPreferences.includes(submissionId) ? 'unlike' : 'like';

                                if (action === 'like') {
                                  // add to list
                                  setMyPreferences([...myPreferences, submissionId]);
                                } else {
                                  // remove from list
                                  setMyPreferences(myPreferences.filter((x) => x !== submissionId));
                                }

                                // dont set loading true here because we dont' want LoadingView
                                if (next && idToken) {
                                  fetch('/api/abstract',
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${idToken}`,
                                      },
                                      body: JSON.stringify({
                                        submission_id: submissionId,
                                        action,
                                      }),
                                    })
                                    .catch((err) => {
                                      console.log('err', err);

                                      // if update failed, revert like status locally
                                      if (action === 'like') {
                                        // remove from list
                                        setMyPreferences(
                                          myPreferences.filter((x) => x !== submissionId),
                                        );
                                      } else {
                                        // add to list
                                        setMyPreferences([...myPreferences, submissionId]);
                                      }
                                    })
                                    .finally(() => setLoading(false));
                                }
                              }}
                              myVotes={myPreferences}
                              timezone={timezone}
                            />
                          )}
                        </AutoSizer>
                      )
                      : (
                        <NoResultText>
                          Sorry, there are no abstracts that match your search query.
                        </NoResultText>
                      )
                }
              </ListContainer>
            </>
          )
          : (
            <p
              css={`
                text-align: center;
                border: 2px solid rgb(248, 42, 96);
                padding: 12px 0;
              `}
            >
              Please register and log-in to view the abstract browser
            </p>
          )}
      </CommonPageStyles>
    </Layout>
  );
};
