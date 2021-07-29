import { navigate } from 'gatsby';
import React from 'react';
import LoadingView from '../components/BaseComponents/LoadingView';
import RegisterForm, { originEnum } from '../components/FormComponents/RegisterForm';
import useValidateRegistration from '../hooks/useValidateRegistration';

// rename this page to /profile

export default () => {
  const {
    isRegistered, isLoggedIn, prevUserData, isFormerUser,
  } = useValidateRegistration();

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate('/conference');
    }, 2500);

    return (
      <LoadingView
        message="You are not logged in, redirecting to homepage.."
      />
    );
  }

  if (isRegistered === false && isFormerUser === false) {
    setTimeout(() => {
      // navigate('/register');
      navigate('/conference');
    }, 2500);

    return (
      <LoadingView
        // message="You are not registered, redirecting to register page.."
        message="The registration is now closed for NMC3 (happened in October 2020)."
      />
    );
  }

  if (isRegistered === false && isFormerUser === true) {
    setTimeout(() => {
      window.location.reload();
    }, 2500);

    return (
      <LoadingView
        // message="We found your registration details from neuromatch 1.0!, migrating to 2.0.."
        message="You are previously registered to NMC3. The conference happened in October 2020."
      />
    );
  }

  if (isRegistered) {
    return (
      <RegisterForm
        prevUserData={prevUserData}
        origin={originEnum.editProfile}
      />
    );
  }

  return <LoadingView />;
};
