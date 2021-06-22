import React from 'react';
import { navigate } from 'gatsby';
import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';
import LoadingView from '../BaseComponents/LoadingView';

const RequiredAuthView = ({ children }) => {
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

  return children;
};

export default RequiredAuthView;
