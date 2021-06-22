import { navigate } from 'gatsby';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import Select from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import LoadingView from '../components/BaseComponents/LoadingView';
import { TextWithButtonsWrapper } from '../components/FormComponents/StyledFormComponents';
import Layout from '../components/layout';
import {
  Bold, PosterCard, PosterFilter, PosterStyledWrapper,
} from '../components/Posters';
import { useAuthenFetchGet } from '../hooks/useFetch';
import useFirebaseWrapper from '../hooks/useFirebaseWrapper';
// import { generateFakePosters } from '../utils/fake';
import useQueryParams from '../hooks/useQueryParams';
import useWindowSize from '../hooks/useWindowSize';
import { mediaSizes, media } from '../utils/ui';

const timeZoneCookieKey = 'timezone';

const accentColors = [
  'd81159', 'b41f58', '8f2d56', '58586b', '218380', 'fbb13c', 'd9ba65', 'b7c28d', '73d2de',
  '210124', 'aa1155', '880044', 'dd1155', 'ffee88', '00cc99', '083d77', 'f4d35e', 'f78764',
  '2a2b2a', 'ff220c', 'd33e43', '9b7874', '666370', '1c1f33', '042a2b', '5eb1bf', 'cdedf6',
  'ef7b45', '37123c', '2e5266', '6e8898', '9fb1bc', 'd3d0cb', 'e2c044', 'f3ca40', 'f2a541',
  'f08a4b', 'd78a76', '7bc950', 'bbdef0', '00a6a6', 'efca08', 'f49f0a', 'f08700', '235789',
  'c1292e', '161925', '0e7c7b', '243010', '87a330', 'a1c349', 'cad593', '2a3c24', 'ff595e',
  'ffca3a', '1982c4', '6a4c93', 'cad593',
];

// const posters = generateFakePosters(25);
// const isLoading = false;

const timeZoneOptions = moment.tz.names()
  .filter((n) => n.includes('/')) // only those have /
  .map((n) => ({
    label: n.replace(/_/g, ' '),
    value: n,
  }));

const availableSlotsInUTC = [
  '2020-05-26 00:00:00',
  '2020-05-26 01:00:00',
  '2020-05-26 09:00:00',
  '2020-05-26 10:00:00',
  '2020-05-27 00:00:00',
  '2020-05-27 01:00:00',
  '2020-05-27 09:00:00',
  '2020-05-27 10:00:00',
];

// guess user timezone
const defaultGuessZone = moment.tz.guess();

export default () => {
  // util hooks
  const { currentUserInfo, isLoggedIn } = useFirebaseWrapper();
  const { result: posters, isLoading } = useAuthenFetchGet(
    currentUserInfo
      ? `/api/get_all_poster_submissions?id=${currentUserInfo.uid}`
      : '/api/get_all_poster_submissions',
    [],
  );
  const { width } = useWindowSize();
  // local state
  const [expandedIndex, setExpandedIndex] = useState(undefined);
  const [filterValue, setFilterValue] = useState('');
  const [filteredPosters, setFilteredPosters] = useState([]);
  const [noOfCols, setNoOfCols] = useState(3);
  const [posterId, setPosterId] = useQueryParams('id');
  const cardRefs = useRef([]);
  const posterAreaRef = useRef(null);
  // timezone and cookies
  const [cookies, setCookie] = useCookies([timeZoneCookieKey]);
  const [timeZone, setTimeZone] = useState(
    cookies[timeZoneCookieKey] || defaultGuessZone,
  );
  const [tzSlots, setTzSlots] = useState([]);

  useEffect(() => {
    setTzSlots(availableSlotsInUTC
      .map((utcTime) => moment
        .tz(
          utcTime,
          'YYYY-MM-DD HH:mm:ss',
          'UTC',
        )
        .tz(timeZone)
        .format('YYYY-MM-DD HH:mm:ss')));
  }, [timeZone]);

  useEffect(() => {
    const currentIndex = posters.map((x) => x.id).indexOf(posterId);
    // top of poster area container - height of navbar - margin top of the first poster card
    const startingPoint = posterAreaRef.current?.offsetTop - 60 - 12;
    const targetCardOffset = cardRefs.current[currentIndex]?.offsetTop;

    const scrollToRef = () => window.scrollTo({
      top: startingPoint + targetCardOffset,
      behavior: 'smooth',
    });

    const timeoutHandler = setTimeout(() => {
      if (targetCardOffset) {
        scrollToRef();
      }
    }, 1);

    setExpandedIndex(currentIndex);

    return () => clearTimeout(timeoutHandler);
  }, [posterId, posters]);

  // calculate first index of the last row
  const firstIndLastRow = (Math.ceil(posters.length / noOfCols) - 1) * noOfCols;

  // control how many columns depending on current screen width here
  useEffect(() => {
    if (width > mediaSizes.medium) {
      setNoOfCols(3);
    }

    if (width >= mediaSizes.small && width <= mediaSizes.medium) {
      setNoOfCols(2);
    }

    if (width < mediaSizes.small) {
      setNoOfCols(1);
    }
  }, [width]);

  // debouncing filter text here
  // https://usehooks.com/useDebounce/
  const [debouncedCallback] = useDebouncedCallback(
    (val) => {
      setFilterValue(val);
    },
    300,
    {
      maxWait: 2000,
      leading: true,
    },
  );

  // control filter results here
  useEffect(() => {
    // title, abstract, fullname, institution
    const filtered = posters.filter((x) => {
      const searchFields = `${x.title} ${x.abstract} ${x.fullname} ${x.institution}`.toLowerCase();

      // filter by substring
      if (searchFields.includes(filterValue)) {
        return true;
      }

      return false;
    });

    // if filter value is empty string, set result as []
    if (filterValue !== '') {
      setFilteredPosters(filtered);
    } else {
      setFilteredPosters([]);
    }
  }, [filterValue, posters]);

  // allow only logged in use to view this page
  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView message="You are not logged in, redirecting to homepage.." />
    );
  }

  if (isLoading === true) {
    return <LoadingView />;
  }

  return (
    <Layout>
      <PosterStyledWrapper noOfCols={noOfCols}>
        <TextWithButtonsWrapper
          css={`
            ${media.medium`
              display: block;

              h2 {
                margin-bottom: 0.5em;
              }
            `}
          `}
        >
          <h2>neuromatch: virtual poster session</h2>
          <div>
            <Select
              css={`
                min-width: 200px;
                font-size: 0.8rem;
              `}
              options={timeZoneOptions}
              defaultValue={timeZoneOptions.find(({ value }) => value === timeZone)}
              onChange={(x) => {
                setTimeZone(x.value);
                setCookie(timeZoneCookieKey, x.value);
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: 'rgba(34,34,34,1)',
                  primary75: 'rgba(34,34,34,0.75)',
                  primary50: 'rgba(34,34,34,0.5)',
                  primary25: 'rgba(34,34,34,0.25)',
                },
              })}
            />
          </div>
        </TextWithButtonsWrapper>
        <p>
          This is a virtual poster session for neuromatch conference.
          Please use the link under each poster to direct to author&apos;s
          poster, recorded talk, and discussion channel during the
          conference. You can checkout poster and recorded talk anytime prior
          to the conference. The discussion will be available during
          neuromatch poster session.
        </p>
        <ul>
          <li>
            <Bold>Usage</Bold>
            {' · '}
            please select timezone on the top-right corner based on your
            location or preferred timezone. The time will be updated according
            to your chosen location.
          </li>
          <li>
            <Bold>Poster information</Bold>
            {' · '}
            Please check
            {' '}
            <b>active slots</b>
            {' '}
            for when presenter is at the poster,
            {' '}
            <b>live discussion</b>
            {' '}
            to link to the their discussion channel (e.g. Zoom, Google Meeting, etc.),
            and
            {' '}
            <b>slides</b>
            {' '}
            to visit their poster,
          </li>
          <li>
            <Bold>Note</Bold>
            {' · '}
            this page is optimized to view on desktop. Please be aware of some
            minor view problems on mobile.
          </li>
        </ul>
        <h3 css="text-align: center; font-weight: bold;">
          Poster presentation time slots
        </h3>
        <table
          css={`
            font-size: 0.85em;
            table-layout: fixed;
            width: auto;
            margin-left: auto;
            margin-right: auto;

            th {
              border: none;
              padding-left: 0em;
              background-color: #f4f4f4;
              border-bottom: 1px solid #ccc;
              padding-top: 3px;
              padding-bottom: 3px;

              /* padding is removed in layout */
              & {
                padding-left: 1em;
                padding-right: 1em;
              }
            }

            tr {
              :not(:nth-child(odd)) {
                background-color: #f4f4f4;
              }

              td {
                width:1px;
                white-space: nowrap;
                font-size: 0.95em;
                border: none;
                padding: 3px 17px;

                /* padding is removed in layout */
                &:first-child {
                  padding-left: 1em;
                  text-align: center;
                }

                &:last-child {
                  padding-right: 1em;
                }
              }
            }
          `}
        >
          <thead>
            <tr>
              <th>Slot</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {tzSlots.map((timeSlot, ind) => (
              <tr key={timeSlot}>
                <td>{ind + 1}</td>
                <td>{moment(timeSlot).format('ddd, MMM D, YYYY')}</td>
                <td>{`${moment(timeSlot).format('h')} - ${moment(timeSlot).add(1, 'h').format('h A')}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <PosterFilter setFilterValue={debouncedCallback} />
        <div className="poster-area" ref={posterAreaRef}>
          {/* if filter result is [], render all posters, else render filter result */}
          {/* the same goes with filler result in the block below */}
          {
            filteredPosters.length > 0
              ? filteredPosters.map((poster, ind) => (
                <PosterCard
                  key={poster.title}
                  posterData={poster}
                  slotOptions={tzSlots}
                  accentColor={accentColors[ind % accentColors.length]}
                  noOfCols={noOfCols}
                  expandLeft={(ind + 1) % noOfCols === 0}
                  lastRow={noOfCols === 1
                    ? ind > firstIndLastRow - 2
                    : ind >= firstIndLastRow && firstIndLastRow !== 0}
                  isExpanded={expandedIndex === ind}
                  onClickExpanded={() => {
                    if (expandedIndex !== ind) {
                      setExpandedIndex(ind);
                      setPosterId(poster.id);
                    } else {
                      setExpandedIndex(undefined);
                      setPosterId(undefined);
                    }
                  }}
                />
              ))
              : posters.map((poster, ind) => (
                <PosterCard
                  ref={(el) => { cardRefs.current[ind] = el; }}
                  key={poster.title}
                  posterData={poster}
                  slotOptions={tzSlots}
                  accentColor={accentColors[ind % accentColors.length]}
                  noOfCols={noOfCols}
                  expandLeft={(ind + 1) % noOfCols === 0}
                  lastRow={noOfCols === 1
                    ? ind > firstIndLastRow - 2
                    : ind >= firstIndLastRow && firstIndLastRow !== 0}
                  isExpanded={expandedIndex === ind}
                  onClickExpanded={() => {
                    if (expandedIndex !== ind) {
                      setExpandedIndex(ind);
                      setPosterId(poster.id);
                    } else {
                      setExpandedIndex(undefined);
                      setPosterId(undefined);
                    }
                  }}
                />
              ))
          }
          {/* fill last row */}
          {
            filteredPosters.length > 0
              ? Array.from(
                {
                  length: (
                    noOfCols * Math.ceil(filteredPosters.length / noOfCols)
                  ) - filteredPosters.length,
                },
                (_, k) => k + 1,
              ).map(() => (<i key={Math.random()} aria-hidden="true" />))
              : Array.from(
                { length: (noOfCols * Math.ceil(posters.length / noOfCols)) - posters.length },
                (_, k) => k + 1,
              ).map(() => (<i key={Math.random()} aria-hidden="true" />))
          }
        </div>
      </PosterStyledWrapper>
    </Layout>
  );
};
