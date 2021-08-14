import { useCallback, useEffect, useState } from 'react';
import { useFetchPost, useAuthenFetchGet } from './useFetch';
import useFirebaseWrapper from './useFirebaseWrapper';

/**
 * @typedef {Object} useFirebaseWrapperResult
 * @property {Object} firebaseInstance - a firebase instance from firebase plugin
 * @property {Object} currentUserInfo - info of the current user
 * @property {boolean} isLoadingUserInfo - user info loading status
 * @property {boolean} isLoggedIn - user login status
 * @property {string} idToken - jwt firebase token of the current user
 */

/**
 * @typedef {Object} useValidateRegistrationResult
 * @property {boolean} isValidating - validating status
 * @property {boolean} isRegistered - a result of fetch, undefined implying isLoading
 * @property {boolean} [isFormerUser=undefined] - indicate if this is a former user
 * @property {string} reviewerId - indicate if this user registered for a reviewer
 * @property {Object} prevUserData - previous data of the user
 */

/**
 * this defined return type which is a validateRegistrationResult
 * that inherits firebaseWrapperResult
 * https://stackoverflow.com/a/55358934/4010864
 * @typedef {useValidateRegistrationResult & useFirebaseWrapperResult} Mixed
 */

/**
 * useValidateRegistration
 * @return {Mixed}
 */
function useValidateRegistration() {
  const { currentUserInfo, ...restFirebaseWrapper } = useFirebaseWrapper();
  const [isRegistered, setIsRegistered] = useState(undefined);
  const [prevUserData, setPrevUserData] = useState(undefined);
  const [isValidating, setIsValidating] = useState(true);
  const [isFormerUser, setIsFormerUser] = useState(undefined);
  const [reviewerId, setReviewerId] = useState(undefined);

  // get user registered data if there is
  useAuthenFetchGet(
    currentUserInfo ? `/api/get_user_data?doc_id=${currentUserInfo.uid}` : undefined,
    undefined,
    useCallback((resJson) => {
      setPrevUserData(resJson);
    }, []),
  );

  // check if this user registered in the previous edition
  // if yes, migrate to the new collection
  useFetchPost(
    isRegistered === false ? '/api/migrate_from_last_edition' : undefined,
    undefined,
    currentUserInfo
      ? {
        id: currentUserInfo.uid,
      }
      : undefined,
    // success callback
    useCallback(() => setIsFormerUser(true), []),
    // failed callback
    useCallback(() => setIsFormerUser(false), []),
  );

  // check if user is registered and have data
  useEffect(() => {
    if (prevUserData) {
      // if there is fullname or email, consider as registered
      if (prevUserData.fullname || prevUserData.email) {
        setIsRegistered(true);
        setIsValidating(false);
      } else {
        setIsRegistered(false);
        setIsValidating(false);
      }

      if (prevUserData?.reviewer_id && prevUserData?.reviewer_id !== '') {
        setReviewerId(prevUserData.reviewer_id);
      } else {
        setReviewerId('');
      }
    }

    if (prevUserData === null) {
      // if response is null, there is no record for this user at all
      setIsRegistered(false);
      setIsValidating(false);
    }
  }, [prevUserData]);

  return {
    reviewerId,
    isFormerUser,
    isValidating,
    isRegistered,
    prevUserData,
    currentUserInfo,
    ...restFirebaseWrapper,
  };
}

export default useValidateRegistration;
