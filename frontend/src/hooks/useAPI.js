import { useCallback } from "react"
import useFirebaseWrapper from "./useFirebaseWrapper"

const endpoints = {
  affiliation: "/api/affiliation",
  user: "/api/user",
  userPreference: "/api/user/preference",
  confirmation: "/api/confirmation",
  migration: "/api/migration",
}

const contentTypeHeader = {
  "Content-Type": "application/json",
}

const authHeader = token => ({
  Authorization: `Bearer ${token}`,
})

function useAPI() {
  const { idToken } = useFirebaseWrapper()

  return {
    register: useCallback(data => {
      return fetch(endpoints.user, {
        method: "POST",
        headers: {
          ...contentTypeHeader,
        },
        body: JSON.stringify(data),
      })
    }, []),
    getUserData: useCallback(() => {
      return fetch(endpoints.user, {
        headers: {
          ...authHeader(idToken),
        },
      })
    }, [idToken]),
  }
}

export default useAPI
