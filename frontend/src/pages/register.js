import { navigate } from 'gatsby';
import React from 'react';
import LoadingView from '../components/BaseComponents/LoadingView';
import RegisterForm, { originEnum } from '../components/RegisterForm';
import useFirebaseWrapper from '../hooks/useFirebaseWrapper';
import useValidateRegistration from '../hooks/useValidateRegistration';

export default () => {
  const { isRegistered } = useValidateRegistration();
  const { isLoggedIn } = useFirebaseWrapper();

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView
        message="You are not logged in, redirecting to homepage.."
      />
    );
  }

  if (isRegistered) {
    setTimeout(() => {
      navigate('/edit-profile');
    }, 2500);

    return (
      <LoadingView
        message="You have already registered, redirecting to /edit-profile.."
      />
    );
  }

  if (isRegistered === false) {
    return (
      <RegisterForm
        origin={originEnum.register}
      />
    );
  }

  return <LoadingView />;
};
