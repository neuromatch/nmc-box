import { useState } from "react"
import { useFirebase } from "gatsby-plugin-firebase"

/**
 * @typedef {Object} userInfoObj
 * @property {string} displayName
 * @property {string} email
 * @property {string} uid
 * @property {string} photoURL
 *
 * @typedef {Object} useFirebaseWrapperResult
 * @property {Object} firebaseInstance - a firebase instance from firebase plugin
 * @property {userInfoObj} currentUserInfo - info of the current user
 * @property {boolean} isLoadingUserInfo - user info loading status
 * @property {boolean} isLoggedIn - user login status
 * @property {string} idToken - jwt firebase token of the current user
 */

/**
 * useValidateRegistration
 * @return {useFirebaseWrapperResult}
 */
function useFirebaseWrapper() {
  const [firebaseInstance, setFirebaseInstance] = useState(null)
  const [currentUserInfo, setCurrentUserInfo] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true)
  const [idToken, setIdToken] = useState(null)

  // @ts-ignore
  useFirebase(firebase => {
    setFirebaseInstance(firebase)

    // handle auth state change
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log('The user has signed in..');
        setCurrentUserInfo(user)
        // also get idToken in case we want to use if
        // outside useAuthenFetch
        if (user) {
          user.getIdToken().then(idt => setIdToken(idt))
        }

        setIsLoggedIn(true)
        setIsLoadingUserInfo(false)
      } else {
        // console.log('The user has signed out..');
        setIsLoggedIn(false)
        setIsLoadingUserInfo(false)
      }
    })
  })

  return {
    firebaseInstance,
    currentUserInfo,
    isLoadingUserInfo,
    isLoggedIn,
    idToken,
  }
}

export default useFirebaseWrapper
