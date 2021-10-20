import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';

const RequiredAuthFragment = ({ enable, children }) => {
  const { isLoggedIn } = useFirebaseWrapper();

  if (!isLoggedIn && enable) {
    return null;
  }

  return children;
};

export default RequiredAuthFragment;
