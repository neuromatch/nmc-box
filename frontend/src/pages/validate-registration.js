import { navigate } from 'gatsby';
import React, { useEffect } from 'react';
import LoadingView from '../components/BaseComponents/LoadingView';
import useValidateRegistration from '../hooks/useValidateRegistration';

export default () => {
  const { isRegistered, isFormerUser } = useValidateRegistration();

  useEffect(() => {
    if (isRegistered) {
      setTimeout(() => {
        navigate('/conference');
      }, 1500);
    }

    // undefined implies isLoading
    if (isRegistered === false && isFormerUser === false) {
      setTimeout(() => {
        // navigate('/register');
        navigate('/conference');
      }, 2500);
    }

    if (isRegistered === false && isFormerUser === true) {
      setTimeout(() => {
        // navigate('/edit-profile');
        navigate('/conference');
      }, 2500);
    }
  }, [isRegistered, isFormerUser]);

  return (
    <LoadingView
      message={
        isRegistered === false && isFormerUser === true
          // ? 'We found your registration details from previous
          // editions of neuromatch!, migrating to 3.0..'
          ? 'Registration is now closed for NMC3 (happended in October 2020)..'
          : isRegistered === false && isFormerUser === false
          // ? 'You will be brought to registration page as we cannot find your data..'
            ? 'Registration is now closed for NMC3 (happended in October 2020)..'
            : isRegistered
              ? 'You are being redirected to homepage..'
              : null
      }
    />
  );
};
