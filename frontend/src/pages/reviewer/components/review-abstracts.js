/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { navigate } from 'gatsby';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { ErrorMessage, useForm } from 'react-hook-form';
import styled from 'styled-components';
import {
  ButtonsContainer,
  FormButton, LineButton,
} from '../../../components/BaseComponents/Buttons';
import LoadingView from '../../../components/BaseComponents/LoadingView';
import { ControlSelect } from '../../../components/FormComponents/SelectWrapper';
import {
  FormWrapper,
  InputBlock,
  TextWithButtonsWrapper,
  WarningMessage,
} from '../../../components/FormComponents/StyledFormComponents';
import Layout from '../../../components/layout';
import { AbstractsReviewerTable } from '../../../components/TableComponents';
import { useAuthenFetchGet } from '../../../hooks/useFetch';
import useValidateRegistration from '../../../hooks/useValidateRegistration';
// import { generateFakeAbstracts } from '../utils/fake';
import Fa from '../../../utils/fontawesome';
import { media } from '../../../utils/ui';
import { selectConverter } from '../../../utils';

const DarkLineButton = styled(LineButton)``;

DarkLineButton.defaultProps = {
  color: '#333',
  hoverColor: '#fff',
  hoverBgColor: '#444',
};

const BoldText = styled.span`
  font-weight: bold;
`;

// const mockData = generateFakeAbstracts(30);

export default () => {
  // -- STATE
  // get user info
  const {
    // currentUserInfo,
    isLoggedIn,
    isRegistered,
    reviewerId,
  } = useValidateRegistration();

  const { result: allSubmissions } = useAuthenFetchGet(
    reviewerId && `/api/get_review_submissions?reviewer_id=${reviewerId}`,
    [],
  );
  const [currentAbstractIndex, setCurrentAbstractIndex] = useState(undefined);
  const [currentAbstract, setCurrentAbstract] = useState(undefined);
  const [submissionsStatus, setSubmissionsStatus] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const {
    handleSubmit,
    errors,
    control,
    setValue,
  } = useForm();

  // side effect for update currentAbstract
  // this effect also sets value on score and confidence dropdown
  // when currentAbstractIndex is updated
  useEffect(() => {
    const nextAbstract = allSubmissions[currentAbstractIndex];
    setCurrentAbstract(nextAbstract);

    // get score and confidence from current abstract in submissionStatus
    const currentSubmissionStatus = submissionsStatus.find((x) => x?.id === nextAbstract?.id);

    const score = currentSubmissionStatus?.score;
    const confidence = currentSubmissionStatus?.confidence;

    // if there are both score and confidence
    // set value of ControlSelects
    if (score && confidence) {
      setValue('scoreSelect', {
        label: score,
        value: score,
      });

      setValue('confidenceSelect', {
        label: confidence,
        value: confidence,
      });
    } else {
      setValue('scoreSelect', null);
      setValue('confidenceSelect', null);
    }
  }, [allSubmissions, currentAbstractIndex, setValue]);

  // get initial status from fetched data
  useEffect(() => {
    const alreadyMarked = allSubmissions.map((x) => {
      const score = x?.fields?.score;
      const confidence = x?.fields?.confidence;

      const marked = score && confidence;

      // there should be score and confidence in the status
      if (marked) {
        return {
          id: x.id,
          score,
          confidence,
        };
      }

      return undefined;
    }).filter((y) => y);

    setSubmissionsStatus(alreadyMarked);

    // console.log('in allSubmissions side effect');
  }, [allSubmissions]);

  // -- DATA
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'submission_index',
      },
      {
        Header: 'Title',
        accessor: 'fields.title',
      },
    ],
    [],
  );

  const tableData = useMemo(() => allSubmissions.map((x, index) => {
    // TODO: implement watching score and confidence to show indicator here
    const updatedData = submissionsStatus.find((y) => y.id === x.id);

    // intercept data before sending to the table
    // if score and confidence are added, mark ✅
    if (updatedData && updatedData?.score && updatedData?.confidence) {
      const updatedRow = {
        ...x,
        submission_index: `${index} ✅`,
      };
      return updatedRow;
    }

    return {
      ...x,
      submission_index: index,
    };
  }), [allSubmissions, submissionsStatus]);

  // -- FUNCTION
  const onSubmit = (data) => {
    const {
      id: recordId,
      fields: {
        // declared in upper scope
        // reviewer_id: reviewerId,
        submission_id: submissionId,
        title,
        abstract,
      },
    } = currentAbstract;

    const { scoreSelect, confidenceSelect } = data;
    // get current score and confidence to use both in payload
    // and submission status
    const currentScore = selectConverter.optionsToSaveFormat(scoreSelect);
    const currentConfidence = selectConverter.optionsToSaveFormat(confidenceSelect);

    const preparedPayload = {
      payload: [{
        id: recordId,
        fields: {
          reviewer_id: reviewerId,
          submission_id: submissionId,
          title,
          abstract,
          score: currentScore,
          confidence: currentConfidence,
        },
      }],
    };

    // console.log('before submitting:', preparedPayload);

    setIsSending(true);

    fetch('/api/update_review_scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preparedPayload),
    })
      .then(() => {
        setIsSending(false);

        // update submission status with this submitted values
        // of score and confidence
        setSubmissionsStatus([
          ...submissionsStatus.filter((x) => x.id !== recordId),
          {
            id: recordId,
            score: currentScore,
            confidence: currentConfidence,
          },
        ]);

        const nextIndex = currentAbstractIndex + 1;

        if (nextIndex > allSubmissions.length - 1) {
          return;
        }

        // move to next abstract
        setCurrentAbstractIndex(nextIndex);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSending(false));
  };

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView message="You are not logged in, redirecting to homepage.." />
    );
  }

  if (isRegistered === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView message="You are not registered, please register before submitting abstract.." />
    );
  }

  if (isRegistered) {
    // fullname, email, Co-authors, title, abstract, talk formats
    const currentSubmissionStatus = currentAbstract
      ? submissionsStatus.find((x) => x.id === currentAbstract.id)
      : {};

    return (
      <Layout>
        <h2>Editor panel</h2>
        <TextWithButtonsWrapper>
          <h3>List of abstracts</h3>
        </TextWithButtonsWrapper>
        <p>Click on the title to open details in the viewer below.</p>
        <AbstractsReviewerTable
          defaultColumns={columns}
          data={tableData}
          handleTitleClick={(currentRowIndex) => {
            setCurrentAbstractIndex(currentRowIndex);
          }}
        />
        <TextWithButtonsWrapper>
          <h3>Abstract viewer</h3>
          <div>
            <DarkLineButton
              type="button"
              onClick={() => {
                if (currentAbstractIndex === undefined) {
                  return;
                }

                const prevIndex = currentAbstractIndex - 1;

                if (prevIndex < 0) {
                  return;
                }

                setCurrentAbstractIndex(prevIndex);
              }}
              disabled={
                currentAbstractIndex === 0 || currentAbstractIndex === undefined
              }
            >
              <Fa icon="caret-left" />
              {' '}
              Previous
            </DarkLineButton>
            <DarkLineButton
              type="button"
              onClick={() => {
                if (currentAbstractIndex === undefined) {
                  return;
                }

                const nextIndex = currentAbstractIndex + 1;

                if (nextIndex > allSubmissions.length - 1) {
                  return;
                }

                setCurrentAbstractIndex(nextIndex);
              }}
              disabled={
                currentAbstractIndex === allSubmissions.length - 1
                || currentAbstractIndex === undefined
              }
            >
              Next
              {' '}
              <Fa icon="caret-right" />
            </DarkLineButton>
          </div>
        </TextWithButtonsWrapper>
        {currentAbstract ? (
          <FormWrapper
            css={`
              position: relative;

              textarea,
              input {
                cursor: default;
              }

              span.abs-number {
                position: absolute;
                top: 0;
                right: 10px;
                font-weight: bold;
                font-size: 2em;

                ${media.small`
                  top: 10px;
                `}
              }
            `}
          >
            <span className="abs-number">{currentAbstractIndex}</span>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p>
                <BoldText>ID</BoldText>
                {` · ${currentAbstract.fields.submission_id}`}
              </p>
              {/* used react-dropdown? */}
              <InputBlock>
                <label>Talk format</label>
                <input value={currentAbstract.fields.talk_format || '-'} readOnly />
              </InputBlock>
              <InputBlock>
                <label>Title</label>
                <input value={currentAbstract.fields.title} readOnly />
              </InputBlock>
              {/* use textarea */}
              <InputBlock>
                <label>Abstract</label>
                <TextareaAutosize
                  css={`
                    resize: vertical;
                  `}
                  value={currentAbstract.fields.abstract}
                  rows={3}
                  readOnly
                />
              </InputBlock>
              {
                currentSubmissionStatus
                  ? (
                    <ButtonsContainer>
                      {`This was ${currentSubmissionStatus.status}ed by ${currentSubmissionStatus.marked_by}`}
                    </ButtonsContainer>
                  )
                  : null
              }
              <ButtonsContainer>
                {/* implement use-form-hook */}
                <InputBlock>
                  <label css="font-weight: bold">
                    Score
                  </label>
                  <ControlSelect
                    name="scoreSelect"
                    control={control}
                    isRequired="Score is required."
                    placeholder="Select.."
                    menuPlacement="top"
                    css={`
                      min-width: 160px;
                      margin-right: 15px;
                    `}
                    options={[
                      { label: 1, value: 1 },
                      { label: 2, value: 2 },
                      { label: 3, value: 3 },
                      { label: 4, value: 4 },
                      { label: 5, value: 5 },
                    ]}
                  />
                </InputBlock>
                <InputBlock>
                  <label css="font-weight: bold">
                    Confidence
                  </label>
                  <ControlSelect
                    name="confidenceSelect"
                    control={control}
                    isRequired="Confidence is required."
                    placeholder="Select.."
                    menuPlacement="top"
                    css={`
                      min-width: 160px;
                    `}
                    options={[
                      { label: 1, value: 1 },
                      { label: 2, value: 2 },
                      { label: 3, value: 3 },
                      { label: 4, value: 4 },
                      { label: 5, value: 5 },
                    ]}
                  />
                </InputBlock>
              </ButtonsContainer>
              <div css="text-align: center;">
                <ErrorMessage
                  errors={errors}
                  name="scoreSelect"
                  as={<WarningMessage />}
                />
                <ErrorMessage
                  errors={errors}
                  name="confidenceSelect"
                  as={<WarningMessage />}
                />
              </div>
              <ButtonsContainer>
                <FormButton
                  color="#21bf73"
                  hoverColor="#eee"
                  hoverBgColor="#21bf73"
                  as="input"
                  value={
                    isSending
                      ? 'Sending..'
                      : 'Submit'
                  }
                  disabled={isSending}
                />
              </ButtonsContainer>
            </form>
          </FormWrapper>
        ) : (
          <p>Please select abstract from the table above.</p>
        )}
      </Layout>
    );
  }

  return <LoadingView />;
};
