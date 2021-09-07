import { useEffect, useState } from "react"
import useAPI from "./useAPI"

/**
 * @typedef {Object} useValidateRegistrationResult
 * @property {boolean} isValidating - validating status
 * @property {boolean} isRegistered - a result of fetch
 * @property {Object} prevUserData - previous data of the user
 */

/**
 * useValidateRegistration
 * @return {useValidateRegistrationResult}
 */
function useValidateRegistration() {
  const [isValidating, setIsValidating] = useState(true)
  const [isRegistered, setIsRegistered] = useState(null)
  const [prevUserData, setPrevUserData] = useState(null)

  const { getUserData } = useAPI()

  useEffect(() => {
    getUserData()
      .then(res => res.json())
      .then(userData => {
        setPrevUserData(userData)

        // -- checking
        // if there is fullname or email, consider as registered
        if (userData?.fullname || userData?.email) {
          setIsRegistered(true)
        } else {
          setIsRegistered(false)
        }
      })
      .finally(() => setIsValidating(false))
  }, [getUserData])

  return {
    isValidating,
    isRegistered,
    prevUserData,
  }
}

export default useValidateRegistration
