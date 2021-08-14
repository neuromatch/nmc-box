import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle, css } from 'styled-components';

import { config } from '@fortawesome/fontawesome-svg-core';
import useFirebaseWrapper from '../hooks/useFirebaseWrapper';
import { Container } from './BaseComponents/container';
import NavBar, { AcademyNavbar } from './Navbar';
import Footer from './Footer';
import SEO from './BaseComponents/SEO';
import LoginModal from './LoginModal';
import { confirmPromise } from '../utils';
import { LineButton, DropdownButton } from './BaseComponents/Buttons';
import { initFontAwesome } from '../utils/fontawesome';

// https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
// This ensures that the icon CSS is loaded immediately before attempting to render icons
import '@fortawesome/fontawesome-svg-core/styles.css';
import CookieBanner from './CookieBanner';
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false;

const FixHorizontalScroll = createGlobalStyle`
  body {
    overflow-x: hidden;
  }
`;

const StickyFooterWrapper = styled.div`
  /* sticky footer */
  display: flex;
  height: 100%;
  min-height: 100vh;
  flex-direction: column;
`;

const linkStyle = css`
  color: #eee;
  height: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #419eda;
  }
`;

const StyledLink = styled(Link)`
  ${linkStyle}
`;

const StyledA = styled.a`
  ${linkStyle}
`;

// every page uses layout so load fontawesome here
initFontAwesome();

const Layout = ({
  children, noPadding, containerStyle, hideFooter,
}) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const {
    firebaseInstance: firebase,
    currentUserInfo: user,
    isLoadingUserInfo,
  } = useFirebaseWrapper();

  return (
    <>
      <SEO />
      <FixHorizontalScroll />
      <CookieBanner />
      <LoginModal
        modalVisible={loginModalVisible}
        hideModal={() => setLoginModalVisible(false)}
      />
      <StickyFooterWrapper>
        <NavBar>
          <DropdownButton
            noButtonBorder
            dropdownContent={[
              {
                text: 'How to register',
                onClick: '/instructions/how-to-register',
              },
              {
                text: 'How to submit',
                onClick: '/instructions/how-to-submit',
              },
            ]}
          >
            Instructions
          </DropdownButton>
          <DropdownButton
            noButtonBorder
            dropdownContent={[
              {
                text: 'Agenda',
                onClick: '/agenda',
              },
              {
                text: 'Abstract Browser',
                onClick: '/abstract-browser',
              },
            ]}
          >
            Agenda
          </DropdownButton>
          <DropdownButton
            noButtonBorder
            dropdownContent={[
              {
                text: 'FAQ',
                onClick: '/faq',
              },
              {
                text: 'About',
                onClick: '/about',
              },
            ]}
          >
            About
          </DropdownButton>
          {
            firebase
              ? isLoadingUserInfo
                ? null
                : !user
                  ? (
                    <LineButton
                      onClick={() => setLoginModalVisible(!loginModalVisible)}
                    >
                      Login for NMC
                    </LineButton>
                  )
                  : (
                    <DropdownButton
                      dropdownContent={[
                        {
                          text: 'Profile',
                          onClick: '/edit-profile',
                        },
                        {
                          text: 'Submission',
                          onClick: '/abstract-submission',
                        },
                        {
                          text: 'Logout',
                          onClick: () => confirmPromise('Are you sure to log out?')
                            .then(() => {
                              firebase.auth().signOut()
                                .then(() => {
                                  // console.log('sign out successfully!');

                                  if (window.location.pathname === '/') {
                                    window.location.reload();
                                  } else {
                                    navigate('/');
                                  }
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                              // console.log('cancel logging out');
                            }),
                        },
                      ]}
                    >
                      {
                        user.displayName
                          ? `Hi ${user.displayName.split(' ')[0]}!`
                          : user.email
                            ? `Hi ${user.email.split('@')[0]}!`
                            : 'Hi there!'
                      }
                    </DropdownButton>
                  )
              : null
          }
        </NavBar>

        <Container noPadding={noPadding} css={containerStyle}>
          {children}
        </Container>

        {hideFooter
          ? null
          : <Footer />}
      </StickyFooterWrapper>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  noPadding: PropTypes.bool,
  containerStyle: PropTypes.string,
  hideFooter: PropTypes.bool,
};

Layout.defaultProps = {
  children: null,
  noPadding: false,
  containerStyle: '',
  hideFooter: false,
};

export default Layout;
