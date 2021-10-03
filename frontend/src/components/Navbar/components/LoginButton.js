import { navigate } from "gatsby"
import React, { useState } from "react"
import useFirebaseWrapper from "../../../hooks/useFirebaseWrapper"
import { confirmPromise } from "../../../utils"
import { LineButton } from "../../BaseComponents/Buttons"
import LoginModal from "../../LoginModal"
import DropdownButton from "./DropdownButton"

const LoginButton = () => {
  const {
    firebaseInstance: firebase,
    currentUserInfo: user,
    isLoadingUserInfo,
  } = useFirebaseWrapper()

  const [loginModalVisible, setLoginModalVisible] = useState(false)

  return (
    <>
      <LoginModal
        modalVisible={loginModalVisible}
        hideModal={() => setLoginModalVisible(false)}
      />
      {firebase ? (
        isLoadingUserInfo ? null : !user ? (
          <LineButton onClick={() => setLoginModalVisible(!loginModalVisible)}>
            Login / Register
          </LineButton>
        ) : (
          <DropdownButton
            dropdownContent={[
              {
                text: "Profile",
                onClick: "/edit-profile",
              },
              {
                text: "Submission",
                onClick: "/submission",
              },
              {
                text: "Payment",
                onClick: "/payment",
              },
              {
                text: "Logout",
                onClick: () =>
                  confirmPromise("Are you sure to log out?")
                    .then(() => {
                      firebase
                        .auth()
                        .signOut()
                        .then(() => {
                          // console.log('sign out successfully!');

                          if (window.location.pathname === "/") {
                            window.location.reload()
                          } else {
                            navigate("/")
                          }
                        })
                    })
                    .catch(err => {
                      console.log(err)
                      // console.log('cancel logging out');
                    }),
              },
            ]}
          >
            {user.displayName
              ? `Hi ${user.displayName.split(" ")[0]}!`
              : user.email
              ? `Hi ${user.email.split("@")[0]}!`
              : "Hi there!"}
          </DropdownButton>
        )
      ) : null}
    </>
  )
}

export default LoginButton
