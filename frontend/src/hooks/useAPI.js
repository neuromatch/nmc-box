import { useCallback } from "react"
import useFirebaseWrapper from "./useFirebaseWrapper"

const endpoints = {
  affiliation: "/api/affiliation",
  abstract: '/api/abstract',
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
    getAffiliation: useCallback(q => {
      return fetch(endpoints.affiliation + `?q=${q}`)
    }, []),
    register: useCallback(
      data => {
        return fetch(endpoints.user, {
          method: "POST",
          headers: {
            ...contentTypeHeader,
            ...authHeader(idToken),
          },
          body: JSON.stringify(data),
        })
      },
      [idToken]
    ),
    getUserData: useCallback(() => {
      return fetch(endpoints.user, {
        headers: {
          ...authHeader(idToken),
        },
      })
    }, [idToken]),
    submitAbstract: useCallback(({ edition, data }) => {
      return fetch(`${endpoints.abstract}/${edition}`, {
        method: "POST",
        headers: {
          ...contentTypeHeader,
          ...authHeader(idToken),
        },
        body: JSON.stringify(data),
      })
    }, [idToken]),
    getAbstract: useCallback(({ edition, submissionId }) => {
      return fetch(`${endpoints.abstract}/${edition}/${submissionId}`, {
        headers: {
          ...authHeader(idToken),
        },
      })
    }, [idToken]),
    updateAbstract: useCallback(({ edition, data, submissionId }) => {
      return fetch(`${endpoints.abstract}/${edition}/${submissionId}`, {
        method: "PUT",
        headers: {
          ...contentTypeHeader,
          ...authHeader(idToken),
        },
        body: JSON.stringify(data),
      })
    }, [idToken]),
    /**
     * @param {('registration'|'submission'|'mindmatch')} type
     */
    sendConfirmationEmail: useCallback(type => {
      return fetch(`${endpoints.confirmation}/${type}`, {
        method: "POST",
        headers: {
          ...authHeader(idToken),
        },
      })
    }, [idToken])
  }
}

export default useAPI