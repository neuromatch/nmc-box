/* eslint-disable jsx-a11y/label-has-associated-control */
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled, { css } from 'styled-components';
import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';
import Fa from '../../utils/fontawesome';
import { growOverParentPadding } from '../../styles';
import { ButtonsContainer, FormButton } from '../BaseComponents/Buttons';
import { ControlSelect } from '../FormComponents/SelectWrapper';

// functions to transform data shape between
// react-select shape and save to db shape
const selectConverter = {
  optionsToSaveFormat: (val) => {
    // for isMulti
    if (Array.isArray(val)) {
      return val.map((k) => k.value);
    }

    return val.value;
  },
  saveFormatToOptions: (val, options) => {
    // for isMulti
    if (Array.isArray(val)) {
      return options.filter((x) => val.includes(x.value));
    }

    return options.find((x) => x === val);
  },
};

const Bold = styled.span`
  font-weight: bold;
`;

/**
 * The outer container wrapping all components in the page
 */
const PosterStyledWrapper = styled.div`
  h2 {
    font-weight: bold;
  }

  /* area to render posters grows beyond parent container */
  .poster-area {
    ${growOverParentPadding(98)}

    /* we use flex wrap + fixed poster width to control layout of the page */
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    /* space from footer */
    margin-bottom: 2em;
  }

  /* dummy object to fill the last row if needed */
  /* https://dev.to/stel/a-little-trick-to-left-align-items-in-last-row-with-flexbox-230l */
  i {
    width: ${(p) => (94 / p.noOfCols)}vw;
    margin: ${(p) => (4 / (p.noOfCols * 2))}vw;

    max-height: 300px;
  }
`;

PosterStyledWrapper.propTypes = {
  noOfCols: PropTypes.number.isRequired,
};

/**
 * The block to render detail of the poster. The position is absolute
 * and relative to its parent.
 */
const ExpandableDetail = styled.div`
  position: absolute;

  /* -4 is to compensate the border */
  ${(p) => (p.lastRow
    ? css`bottom: -4px;`
    : css`top: -4px;`)}

  ${(p) => (p.expandLeft
    ? css`right: 0px;`
    : css`left: -4px;`)}

  /* card size + margin of 4 sides (2 cards) */
  ${(p) => (p.noOfCols === 1
    ? css`
      width: ${(94 / p.noOfCols)}vw;
    `
    : css`
      width: ${(((94 / p.noOfCols) * 2) + ((4 / (p.noOfCols * 2)) * 2))}vw;
    `)}

  padding: 1em;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #111;
  z-index: 1;

  /* this render \n in the abstract correctly */
  p.extended-abstract {
    white-space: pre-line;
  }

  /* container of title and expand button */
  .title-expand-button {
    .expand-btn {
      color: #111;

      :hover {
        color: #666;
      }

      :active {
        color: #aaa;
      }
    }
  }
`;

ExpandableDetail.propTypes = {
  lastRow: PropTypes.bool.isRequired,
  expandLeft: PropTypes.bool.isRequired,
  noOfCols: PropTypes.number.isRequired,
};

/**
 * A styled wrapper for each poster card
 */
const StyledPosterCard = styled.div`
  /* card appearances */
  border-top: 4px solid #${(p) => p.accentColor};
  border-left: 4px solid #${(p) => p.accentColor};

  ${ExpandableDetail} {
    border: 4px solid #${(p) => p.accentColor};
  }

  width: ${(p) => (94 / p.noOfCols)}vw;
  margin: ${(p) => (4 / (p.noOfCols * 2))}vw;

  background-color: #f0f0f0;
  color: #333;
  padding: 1em;
  border-radius: 5px;

  max-height: 300;

  position: relative;

  /* style for expand button itself */
  button.expand-btn {
    border: none;
    background-color: transparent;
    padding-left: 10px;
    outline: none;
    cursor: pointer;

    :hover {
      color: #666;
    }

    :active {
      color: #333;
    }
  }

  /* style for container of title and expand button */
  div.title-expand-button {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  /* card contents */
  h4, p {
    margin-bottom: 0.25em;
  }

  h4 {
    font-weight: bold;
    font-size: 18px;
    color: inherit;
  }

  p {
    font-size: 13.5px;

    &.abstract-block {
      margin-top: 1em;
    }
  }
`;

StyledPosterCard.propTypes = {
  accentColor: PropTypes.string.isRequired,
  noOfCols: PropTypes.number.isRequired,
};

/**
 * Style for each resource link
 */
const ResourceLink = styled.a.attrs(() => ({
  target: '_blank',
  rel: 'noopener noreferrer',
}))`
  margin: 0;
  padding: 0;

  font-size: 13.5px;
  color: #419eda;
  cursor: pointer;

  /* style when there is no link */
  ${(p) => !p.href && css`
    color: #888;
    cursor: default;

    :hover {
      text-decoration: none;
      color: #888;
    }
  `}

  /* space between each link */
  :first-child, :not(:last-child) {
    margin-right: 5px;
  }
`;

/**
 * A style wrapper for edit poster info form
 */
const StyledFormWrapper = styled.div`
  /* without z-index it is overlaid by the other card */
  z-index: 1;
  position: absolute;
  top: 27px;

  font-size: 13.5px;
  background-color: #fefefe;
  padding: 10px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;

  min-width: 320px;

  form {
    margin: 0;
    display: flex;
    flex-direction: column;

    input {
      border: 1px solid #ccc;
      border-radius: 2px;
      margin: 5px 0;
    }
  }

  /* a container for input and label */
  .input-block {
    display: flex;
    flex-direction: column;

    label {
      font-size: 11.5px;
      font-weight: bold;
    }

    &.select-block {
      label {
        margin-bottom: 0.4em;
      }
    }
  }
`;

/**
 * A form component as modal, this contains inputs which should
 * be updated as user saved
 * @param {func} visibleHook A hook for visibility control
 * @param {func} urlsHook A hook for urls set/get
 * @param {func} slotsHook A hook for available slots set/get
 */
const FormModal = ({ visibleHook, urlsHook, slotsHook }) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm();
  const { currentUserInfo } = useFirebaseWrapper();

  const [localUrls, setLocalUrls] = urlsHook();
  const [activeSlots, setActiveSlots, slotOptions] = slotsHook();
  const [isVisible, setIsVisible] = visibleHook();

  const [isSending, setIsSending] = useState(false);

  // get options for slots select
  const slotSelectOptions = slotOptions.map((slot, ind) => ({
    label: `${ind + 1}: ${moment(slot).format('Do, h A')}`,
    value: ind + 1,
  }));

  // if there is url, set it on the input too
  useEffect(() => {
    if (localUrls.length > 0) {
      localUrls.forEach(({ text, url }) => setValue(text, url));
    }
  }, [localUrls, setValue, isVisible]);

  // if there is active slots, set it on the input too
  useEffect(() => {
    if (activeSlots.length > 0) {
      setValue(
        'activeSlotsSelect',
        selectConverter.saveFormatToOptions(activeSlots, slotSelectOptions),
      );
    }
  }, [setValue, isVisible, activeSlots, slotSelectOptions]);

  return isVisible
    ? (
      <StyledFormWrapper>
        <p>
          Edit information for your poster here.
        </p>
        <form
          onSubmit={handleSubmit((data) => {
            const { activeSlotsSelect, ...urlsData } = data;

            setIsSending(true);
            //  save user settings to the server
            fetch('/api/set_poster_submission_data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: currentUserInfo.uid,
                urls: Object.entries(urlsData).map(([text, url]) => ({ text, url })),
                available_slots: selectConverter.optionsToSaveFormat(activeSlotsSelect),
              }),
            }).then((res) => {
              if (res.ok) {
                // if submission success, hide modal, and set local urls state
                setIsSending(false);
                setIsVisible(!isVisible);
                setLocalUrls(
                  Object.entries(urlsData).map(([k, v]) => ({ text: k, url: v })),
                );
                setActiveSlots(selectConverter.optionsToSaveFormat(activeSlotsSelect));
              }
            });
          })}
        >
          <div className="input-block">
            <label>
              Live Discussion
            </label>
            <input placeholder="Discussion URL" name="discussion" type="url" ref={register} />
          </div>
          <div className="input-block">
            <label>
              Slides
            </label>
            <input placeholder="Slides URL" name="slides" type="url" ref={register} />
          </div>
          <div className="input-block">
            <label>
              Recorded talk
            </label>
            <input placeholder="Recorder talk URL" name="recordedTalk" type="url" ref={register} />
          </div>
          <div className="input-block select-block">
            <label>
              Active slots
            </label>
            <ControlSelect
              name="activeSlotsSelect"
              control={control}
              isMulti
              options={slotSelectOptions}
            />
          </div>
          <ButtonsContainer css="margin-top: 5px;">
            <FormButton
              as="input"
              value={
                isSending
                  ? 'Sending..'
                  : 'Save'
              }
              disabled={isSending}
            />
          </ButtonsContainer>
        </form>
      </StyledFormWrapper>
    )
    : null;
};

FormModal.propTypes = {
  visibleHook: PropTypes.func.isRequired,
  urlsHook: PropTypes.func.isRequired,
  slotsHook: PropTypes.func.isRequired,
};

/**
 * A block that contains links to each poster info
 * @param {object} resourceURLs URLs for this resource buttons group
 * @param {bool} editable Only poster of the owner that is editable
 * @param {func} urlsHook Hook to set/get urls locally
 * @param {func} slotsHook Hook to set/get available slots locally
 */
const ResourceLinksBlock = ({
  resourceURLs, editable, urlsHook, slotsHook,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { discussion, slides, recordedTalk } = resourceURLs;
  const [selectedActiveSlots] = slotsHook();

  return (
    <div css="display: flex; flex-wrap: wrap; position: relative;">
      <ResourceLink href={discussion}>
        [live discussion]
      </ResourceLink>
      <ResourceLink href={slides}>
        [slides]
      </ResourceLink>
      <ResourceLink href={recordedTalk}>
        [recorded talk]
      </ResourceLink>
      {selectedActiveSlots.length > 0
        ? (
          <ResourceLink css="color: green;">
            [
            {`active slots: ${selectedActiveSlots.join(', ')}`}
            ]
          </ResourceLink>
        )
        : null}
      {
        editable
          ? (
            <>
              <button
                type="button"
                css={`
                  background: transparent;
                  border: none;
                  margin: 0;
                  padding: 0;
                  font-size: 13.5px;
                  outline: none;
                  cursor: pointer;

                  :hover {
                    color: #666;
                  }

                  :active {
                    outline: none;
                    color: #333;
                  }
                `}
                onClick={() => setIsVisible(!isVisible)}
              >
                <Fa icon="edit" />
              </button>
              <FormModal
                visibleHook={() => ([isVisible, setIsVisible])}
                urlsHook={urlsHook}
                slotsHook={slotsHook}
              />
            </>
          )
          : null
      }
    </div>
  );
};

ResourceLinksBlock.propTypes = {
  resourceURLs: PropTypes.shape({
    discussion: PropTypes.string,
    slides: PropTypes.string,
    recordedTalk: PropTypes.string,
  }),
  editable: PropTypes.bool,
  urlsHook: PropTypes.func.isRequired,
  slotsHook: PropTypes.func.isRequired,
};

ResourceLinksBlock.defaultProps = {
  resourceURLs: PropTypes.shape({
    discussion: undefined,
    slides: undefined,
    recordedTalk: undefined,
  }),
  editable: PropTypes.false,
};

/**
 * The main component for each poster
 */
const PosterCard = React.forwardRef(({
  posterData, expandLeft, lastRow, isExpanded,
  onClickExpanded, accentColor, noOfCols, slotOptions,
}, ref) => {
  const {
    id, title, fullname, institution, abstract,
    urls, available_slots: availableSlots,
  } = posterData;
  const { currentUserInfo } = useFirebaseWrapper();
  const [localUrls, setLocalUrls] = useState([]);
  const [localSlots, setLocalSlots] = useState([]);

  useEffect(() => {
    // prevent setting this as undefined or null
    setLocalUrls(urls || []);
  }, [urls]);

  useEffect(() => {
    // prevent setting this as undefined or null
    setLocalSlots(availableSlots || []);
  }, [availableSlots]);

  return (
    <StyledPosterCard ref={ref} noOfCols={noOfCols} accentColor={accentColor}>
      <div className="title-expand-button">
        <div>
          <h4>{title}</h4>
          <p>{`${fullname}; ${institution}`}</p>
        </div>
        <button
          className="expand-btn"
          type="button"
          onClick={() => onClickExpanded()}
        >
          <Fa icon="expand-arrows-alt" />
        </button>
      </div>
      <ResourceLinksBlock
        editable={currentUserInfo ? id === currentUserInfo.uid : false}
        // editable
        resourceURLs={localUrls.reduce((acc, cur) => ({ ...acc, [cur.text]: cur.url }), {})}
        urlsHook={() => [localUrls, setLocalUrls]}
        slotsHook={() => [localSlots, setLocalSlots, slotOptions]}
      />
      <p className="abstract-block">
        <Bold>Abstract:</Bold>
        {` ${abstract.substring(0, 210).replace(/([\n\w.,’'"?!@;:#$^&*-_+=() ]+ )\w+/, '$1 ...')}`}
      </p>

      {
        isExpanded
          ? (
            <ExpandableDetail
              expandLeft={expandLeft}
              lastRow={lastRow}
              noOfCols={noOfCols}
            >
              <div className="title-expand-button">
                <div>
                  <h4>{title}</h4>
                  <p>{`${fullname}; ${institution}`}</p>
                </div>
                <button
                  className="expand-btn"
                  type="button"
                  onClick={() => onClickExpanded()}
                >
                  <Fa icon="compress-arrows-alt" />
                </button>
              </div>
              <ResourceLinksBlock
                editable={currentUserInfo ? id === currentUserInfo.uid : false}
                // editable
                resourceURLs={localUrls.reduce((acc, cur) => ({ ...acc, [cur.text]: cur.url }), {})}
                urlsHook={() => [localUrls, setLocalUrls]}
                slotsHook={() => [localSlots, setLocalSlots, slotOptions]}
              />
              <p className="abstract-block extended-abstract">
                <Bold>Abstract:</Bold>
                {` ${abstract}`}
              </p>
            </ExpandableDetail>
          )
          : null
      }
    </StyledPosterCard>
  );
});

PosterCard.propTypes = {
  posterData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    fullname: PropTypes.string,
    institution: PropTypes.string,
    abstract: PropTypes.string,
    urls: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      url: PropTypes.string,
    })),
    available_slots: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    ),
  }).isRequired,
  expandLeft: PropTypes.bool.isRequired,
  lastRow: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onClickExpanded: PropTypes.func.isRequired,
  accentColor: PropTypes.string.isRequired,
  noOfCols: PropTypes.number.isRequired,
  slotOptions: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
};

/**
 * A poster filter block
 */
const PosterFilter = ({ setFilterValue }) => (
  <div
    css={`
      text-align: center;
      margin-bottom: 1em;

      input {
        font-size: 0.85em;
        width: 320px;
        padding: 0 5px;
        border: none;
        border-bottom: 2px solid #333;

        :active, :focus {
          outline: none;
        }
      }
    `}
  >
    <input
      placeholder="type here to filter.."
      onChange={(ev) => setFilterValue(ev.target.value)}
    />
  </div>
);

PosterFilter.propTypes = {
  setFilterValue: PropTypes.func.isRequired,
};

export {
  PosterStyledWrapper, Bold, PosterFilter, PosterCard,
};
