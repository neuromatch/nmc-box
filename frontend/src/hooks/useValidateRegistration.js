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
      .then(res => res.ok
        ? res.json()
        : Promise.reject(res)
      )
      .then(userData => {
        setPrevUserData(userData?.data || {})

        // -- checking
        // if there is fullname or email, consider as registered
        if (userData?.data?.fullname || userData?.data?.email) {
          setIsRegistered(true)
        } else {
          setIsRegistered(false)
        }
      })
      .catch(() => {})
      .finally(() => setIsValidating(false))
  }, [getUserData])

  return {
    isValidating,
    isRegistered,
    prevUserData,
  }
}

export default useValidateRegistration
