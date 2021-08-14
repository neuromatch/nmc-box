import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';

const RequiredAuthFragment = ({ children }) => {
  const { isLoggedIn } = useFirebaseWrapper();

  if (!isLoggedIn) {
    return null;
  }

  return children;
};

export default RequiredAuthFragment;
