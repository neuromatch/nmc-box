import { navigate } from "gatsby"
import React from "react"
import LoadingView from "../components/BaseComponents/LoadingView"
import RegisterForm, {
  originEnum,
} from "../components/FormComponents/RegisterForm"
import useFirebaseWrapper from "../hooks/useFirebaseWrapper"
import useValidateRegistration from "../hooks/useValidateRegistration"

// rename this page to /profile
export default () => {
  const { isRegistered, prevUserData } = useValidateRegistration()
  const { isLoggedIn } = useFirebaseWrapper()

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate("/")
    }, 2500)

    return (
      <LoadingView message="You are not logged in, redirecting to homepage.." />
    )
  }

  if (isRegistered === false) {
    setTimeout(() => {
      navigate("/register")
    }, 2500)

    return (
      <LoadingView message="You are not registered, redirecting to register page.." />
    )
  }

  if (isRegistered) {
    return (
      <RegisterForm
        prevUserData={prevUserData}
        origin={originEnum.editProfile}
      />
    )
  }

  return <LoadingView />
}
