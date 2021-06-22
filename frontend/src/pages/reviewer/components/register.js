import React, { useMemo, useState, useRef } from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import styled from 'styled-components';
import { ButtonsContainer, FormButton } from '../../../components/BaseComponents/Buttons';
import CommonPageStyles from '../../../components/BaseComponents/CommonPageStyles';
import { InputBlock, WarningMessage } from '../../../components/FormComponents/StyledFormComponents';
import Layout from '../../../components/layout';
import useSfnTopicsData from '../../../hooks/gql/useSfnTopicsData';
import { ControlSelect } from '../../../components/FormComponents/SelectWrapper';
import useFirebaseWrapper from '../../../hooks/useFirebaseWrapper';
import Toast, { toastTypes } from '../../../components/BaseComponents/Toast';
import { media } from '../../../utils/ui';

const SelectsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  margin-bottom: 20px;

  /* on large screen we render theme and topic in half */
  & > ${InputBlock} {
    flex: 1;

    :not(:last-child) {
      margin-right: 15px;
    }
  }

  /* on small screen we render them full line */
  ${media.medium`
    flex-direction: column;

    & > ${InputBlock} {
      :not(:last-child) {
        margin-right: 0px;
      }
    }
  `}
`;

const ReviewerRegister = () => {
  const { currentUserInfo: user } = useFirebaseWrapper();
  const [isSending, setIsSending] = useState(false);
  const toastControl = useRef(null);
  const { sfnTopics } = useSfnTopicsData();

  const topicsData = useMemo(() => sfnTopics.map((topic) => ({
    label: topic,
    value: topic,
  })), [sfnTopics]);

  const {
    register,
    handleSubmit,
    errors,
    control,
  } = useForm();

  const onSubmit = (data) => {
    setIsSending(true);

    const { topics, ...rest } = data;

    const preparedPayload = {
      ...rest,
      topic_1: topics?.[0]?.value,
      topic_2: topics?.[1]?.value,
    };

    const readyData = {
      id: user.uid,
      payload: preparedPayload,
    };

    fetch('/api/set_reviewer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(readyData),
    })
      .then(() => {
        toastControl.current.show();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <Layout>
      <Toast
        message="Your reviewer registration form has been submitted."
        type={toastTypes.success}
        ref={toastControl}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CommonPageStyles>
          <h2>Reviewer</h2>
          <p>
            This is a page for people who are reviewing abstracts. Please select
            topics that you would like to review.
          </p>
          <SelectsRow>
            <InputBlock>
              <ControlSelect
                name="topics[0]"
                options={topicsData}
                placeholder="Select topic 1"
                control={control}
                isRequired="Topic 1 is required."
              />
              <ErrorMessage errors={errors} name="topics[0]" as={<WarningMessage />} />
            </InputBlock>
            <InputBlock>
              <ControlSelect
                name="topics[1]"
                options={topicsData}
                placeholder="Select topic 2"
                control={control}
                isRequired="Topic 2 is required."
              />
              <ErrorMessage errors={errors} name="topics[1]" as={<WarningMessage />} />
            </InputBlock>
          </SelectsRow>
          <p>
            Please place your abstract or abstract that you are interested to
            review below. It will be used to algorithmically match with submitted
            papers. This can be the same or different abstract that you put on a
            profile page.
          </p>
          <InputBlock>
            <textarea
              name="abstract"
              placeholder="Place abstract here"
              rows={8}
              ref={register({
                required: 'Abstract is required.',
              })}
            />
            <ErrorMessage errors={errors} name="abstract" as={<WarningMessage />} />
          </InputBlock>
          <ButtonsContainer>
            <FormButton
              as="input"
              value={
                isSending
                  ? 'Submitting..'
                  : 'Submit'
              }
              disabled={isSending}
            />
          </ButtonsContainer>
        </CommonPageStyles>
      </form>
    </Layout>
  );
};

export default ReviewerRegister;
