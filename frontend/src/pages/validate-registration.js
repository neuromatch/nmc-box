import { navigate } from 'gatsby';
import React, { useEffect } from 'react';
import LoadingView from '../components/BaseComponents/LoadingView';
import useValidateRegistration from '../hooks/useValidateRegistration';

export default () => {
  const { isRegistered } = useValidateRegistration();

  useEffect(() => {
    if (isRegistered) {
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }

    // null implies isLoading
    if (isRegistered === false) {
      setTimeout(() => {
        navigate('/register');
      }, 2500);
    }
  }, [isRegistered]);

  return (
    <LoadingView
      message={
        isRegistered === false
          ? 'You will be brought to registration page as we cannot find your data..'
          : isRegistered
            ? 'You are being redirected to homepage..'
            : null
      }
    />
  );
};
