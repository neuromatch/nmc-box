import PropTypes from 'prop-types';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import styled, { createGlobalStyle } from 'styled-components';
import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';
import Fa from '../../utils/fontawesome';
import { media } from '../../utils/ui';

const LockScrollStyle = createGlobalStyle`
  html, body {
    overflow-x: hidden;
    overflow-y: ${(props) => (props.shouldLock ? 'hidden' : 'auto')}
  }
`;

const ModalContainer = styled.div`
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #222;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;

  /* on mobile, show mocal close button instead */
  ${media.extraSmall`
    z-index: 99999;
    overflow-y: hidden;
  `}
`;

const CloseModalButton = styled(Fa).attrs(() => ({
  icon: 'times',
}))`
  color: #eee;
  font-size: 32px;

  position: absolute;
  top: 15px;
  right: 15px;

  &:active {
    color: indianred;
  }
`;

const ButtonsContainer = styled.div`
  padding: 30px 20px;
  border-radius: 12px;

  form {
    margin-bottom: 0;
  }
`;

const HeaderText = styled.h1`
  color: #eee;
  border-bottom: 2px solid #eee;
  margin: 0;
`;

// Configure FirebaseUI.
const uiConfig = (firebase) => ({
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful.
  // Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/validate-registration',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
});

const LoginModal = ({ modalVisible, hideModal }) => {
  const { firebaseInstance: firebase } = useFirebaseWrapper();

  if (!firebase) {
    return null;
  }

  return (
    <>
      <LockScrollStyle shouldLock={modalVisible} />
      <ModalContainer visible={modalVisible}>
        <CloseModalButton
          onClick={() => hideModal()}
        />
        <HeaderText>
          neuromatch conference
        </HeaderText>
        <ButtonsContainer>
          <StyledFirebaseAuth
            uiConfig={uiConfig(firebase)}
            firebaseAuth={firebase.auth()}
          />
        </ButtonsContainer>
      </ModalContainer>
    </>
  );
};

LoginModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default LoginModal;
