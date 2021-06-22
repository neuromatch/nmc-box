import React from 'react';
import LoadingView from '../../components/BaseComponents/LoadingView';
import RequiredAuthView from '../../components/RequiredAuthView';
import useValidateRegistration from '../../hooks/useValidateRegistration';
import ReviewerRegister from './components/register';
import ReviewAbstracts from './components/review-abstracts';

export default () => {
  const { reviewerId } = useValidateRegistration();

  if (reviewerId === undefined) {
    return <LoadingView />;
  }

  return (
    <RequiredAuthView>
      {!reviewerId
        ? <ReviewerRegister />
        : <ReviewAbstracts />}
    </RequiredAuthView>
  );
};
