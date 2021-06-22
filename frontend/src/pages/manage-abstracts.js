/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, navigate } from 'gatsby';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import styled, { css } from 'styled-components';
import {
  ButtonsContainer,
  LineButton,
  DropdownButton,
} from '../components/BaseComponents/Buttons';
import LoadingView from '../components/BaseComponents/LoadingView';
import Toast, { toastTypes } from '../components/BaseComponents/Toast';
import {
  FormWrapper,
  InputBlock,
  TextWithButtonsWrapper,
} from '../components/FormComponents/StyledFormComponents';
import Layout from '../components/layout';
import { AbstractsTable } from '../components/TableComponents';
import { useAuthenFetchGet } from '../hooks/useFetch';
import useValidateRegistration from '../hooks/useValidateRegistration';
// import { generateFakeAbstracts } from '../utils/fake';
import Fa from '../utils/fontawesome';
import { media } from '../utils/ui';
import IO from '../utils/IO';

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
    currentUserInfo,
    isLoggedIn,
    isRegistered,
  } = useValidateRegistration();
  const { result: editors } = useAuthenFetchGet('/api/get_all_editors', []);
  const { result: allSubmissions } = useAuthenFetchGet('/api/get_all_submissions', []);

  const dynamicToastControl = useRef(null);
  const [currentAbstractIndex, setCurrentAbstractIndex] = useState(undefined);
  const [currentAbstract, setCurrentAbstract] = useState(undefined);
  const [clickCount, setClickCount] = useState(0);
  const [isValidEditor, setIsValidEditor] = useState(false);
  const [submissionsStatus, setSubmissionsStatus] = useState([]);

  useEffect(() => {
    setCurrentAbstract(allSubmissions[currentAbstractIndex]);
  }, [allSubmissions, currentAbstractIndex]);

  // effect to detect user click to activate editor status
  useEffect(() => {
    let cleaner;

    if (clickCount === 20) {
      // toastRef.current.show();
      fetch('/api/set_editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUserInfo.uid,
          fullname: currentUserInfo.displayName,
          email: currentUserInfo.email,
        }),
      })
        .then((res) => {
          if (res.ok) {
            dynamicToastControl.current.show();
            cleaner = setTimeout(() => {
              setIsValidEditor(true);
            }, 4000);
          }
        })
        .catch((err) => { console.log(err); });
    }

    return () => clearTimeout(cleaner);
  }, [clickCount, currentUserInfo]);

  useEffect(() => {
    if (currentUserInfo) {
      if (editors.some((x) => x.id === currentUserInfo.uid)) {
        setIsValidEditor(true);
      }
    }
  }, [currentUserInfo, editors]);

  // get initial status from fetched data
  useEffect(() => {
    const alreadyMarked = allSubmissions.map((x) => {
      const keys = Object.keys(x);

      if (keys.includes('status')) {
        return {
          id: x.id,
          status: x.status,
          marked_by: x.marked_by,
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
        Header: 'Author',
        accessor: 'fullname',
      },
      {
        Header: 'Affiliation',
        accessor: 'institution',
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
    ],
    [],
  );

  const tableData = useMemo(() => allSubmissions.map((x) => {
    const updatedData = submissionsStatus.find((y) => y.id === x.id);

    if (updatedData && updatedData.status) {
      const updatedRow = { ...x, submission_index: `${x.submission_index} ${updatedData.status === 'accept' ? '✅' : '❌'}` };
      return updatedRow;
    }

    return x;
  }), [allSubmissions, submissionsStatus]);

  // -- FUNCTION
  const handleAcceptReject = (abstractId, status) => {
    fetch('/api/update_submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: abstractId,
        status,
        marked_by: currentUserInfo.displayName,
      }),
    })
      .then((res) => {
        if (res.ok) {
          // TODO: fix logic here
          setSubmissionsStatus([
            ...submissionsStatus.filter((x) => x.id !== abstractId),
            {
              id: abstractId,
              status,
              marked_by: currentUserInfo.displayName,
            },
          ]);
          // move to next abstract
          setCurrentAbstractIndex(currentAbstractIndex + 1);
        }
      })
      .catch((err) => { console.log(err); });
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

  // if not editor, render 404-like page with a hidden button
  if (isRegistered && !isValidEditor) {
    return (
      <Layout>
        <Toast
          ref={dynamicToastControl}
          type={toastTypes.info}
          message="You are now an editor!"
        />
        <div css="text-align: center;">
          <div
            onClick={() => {
              if (clickCount < 20) {
                setClickCount(clickCount + 1);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
            css="outline: none; :active { outline: none; }"
          >
            <h1 css="cursor: default;">Page not found</h1>
          </div>
          <Link to="/">Go back</Link>
        </div>
      </Layout>
    );
  }

  if (isRegistered && isValidEditor) {
    // fullname, email, Co-authors, title, abstract, talk formats
    const currentSubmissionStatus = currentAbstract
      ? submissionsStatus.find((x) => x.id === currentAbstract.id)
      : {};

    return (
      <Layout>
        <h2>Editor panel</h2>
        <TextWithButtonsWrapper>
          <h3>List of abstracts</h3>
          <div>
            <DropdownButton
              itemsContainerStyles={css`
                z-index: 1;
                top: 2rem;

                ${media.medium`
                  top: 2.25rem;
                  left: auto;
                `}
              `}
              buttonColorProps={{
                color: '#333',
                hoverColor: '#fff',
                hoverBgColor: '#444',
              }}
              dropdownContent={[
                {
                  text: 'Blind reviews',
                  onClick: () => {
                    IO.downloadFile(
                      '/api/download_submission_document?blind_review=true',
                      'neuromatch-submission-blind.docx',
                    );
                  },
                },
                {
                  text: 'Open reviews',
                  onClick: () => {
                    IO.downloadFile(
                      '/api/download_submission_document?blind_review=false',
                      'neuromatch-submission-open.docx',
                    );
                  },
                },
                {
                  text: 'All Submission CSV',
                  onClick: () => {
                    IO.downloadFile(
                      '/api/download_submission_document?blind_review=false&spread_sheet=true',
                      'neuromatch-submission-csv.csv',
                    );
                  },
                },
              ]}
            >
              Download file
            </DropdownButton>
          </div>
        </TextWithButtonsWrapper>
        <p>Click on the title to open details in the viewer below.</p>
        <AbstractsTable
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
            <span className="abs-number">{currentAbstract.submission_index}</span>
            <form>
              <p>
                <BoldText>Author</BoldText>
                {` · ${currentAbstract.fullname}`}
                <br />
                <BoldText>Email</BoldText>
                {` · ${currentAbstract.email}`}
                <br />
                <BoldText>Affiliation</BoldText>
                {` · ${currentAbstract.institution || '-'}`}
              </p>
              {/* used react-dropdown? */}
              <InputBlock>
                <label>Talk format</label>
                <input value={currentAbstract.talk_format || '-'} readOnly />
              </InputBlock>
              <InputBlock>
                <label>Co-authors</label>
                <input
                  value={currentAbstract.coauthors.join(', ') || '-'}
                  readOnly
                />
              </InputBlock>
              {/* use textinput */}
              <InputBlock>
                <label>Title</label>
                <input value={currentAbstract.title} readOnly />
              </InputBlock>
              {/* use textarea */}
              <InputBlock>
                <label>Abstract</label>
                <TextareaAutosize
                  css={`
                    resize: vertical;
                  `}
                  value={currentAbstract.abstract}
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
                <LineButton
                  color="#fd5e53"
                  hoverColor="#eee"
                  hoverBgColor="#fd5e53"
                  onClick={() => handleAcceptReject(
                    currentAbstract.id,
                    'reject',
                  )}
                >
                  Reject
                </LineButton>
                <LineButton
                  color="#21bf73"
                  hoverColor="#eee"
                  hoverBgColor="#21bf73"
                  onClick={() => handleAcceptReject(
                    currentAbstract.id,
                    'accept',
                  )}
                >
                  Accept
                </LineButton>
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
