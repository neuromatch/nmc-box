import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

import { config } from '@fortawesome/fontawesome-svg-core';
import useFirebaseWrapper from '../hooks/useFirebaseWrapper';
import { Container } from './BaseComponents/container';
import { IndexNavbar } from './Navbar';
import { IndexFooter } from './Footer';
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

// const linkStyle = css`
//   color: #eee;
//   height: 100%;
//   display: flex;
//   flex: 1;
//   align-items: center;
//   justify-content: center;

//   &:hover {
//     color: #419eda;
//   }
// `;

// const StyledLink = styled(Link)`
//   ${linkStyle}
// `;

// const StyledA = styled.a`
//   ${linkStyle}
// `;

// every page uses layout so load fontawesome here
initFontAwesome();

const Layout = ({
  children, noPadding, containerStyle, hideFooter,
}) => {
  const showLoginButton = false;
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
        <IndexNavbar>
          <DropdownButton
            noButtonBorder
            dropdownContent={[
              {
                text: 'About NMC',
                onClick: '/about',
              },
              {
                text: 'About NMA',
                onClick: 'https://academy.neuromatch.io/about/mission',
              },
              {
                text: 'Finances',
                onClick: 'https://academy.neuromatch.io/about/our-finances',
              },
            ]}
          >
            About
          </DropdownButton>
          <Link to="/conference">
            <LineButton noBorder>NMC</LineButton>
          </Link>
          <Link to="https://www.neuromatchacademy.org">
            <LineButton noBorder>NMA</LineButton>
          </Link>
          <DropdownButton
            noButtonBorder
            dropdownContent={[
              {
                text: 'NMC FAQ',
                onClick: '/faq',
              },
              {
                text: 'NMA FAQ',
                onClick: 'https://academy.neuromatch.io/faq',
              },
            ]}
          >
            FAQ
          </DropdownButton>
          {
            showLoginButton && firebase
              ? isLoadingUserInfo
                ? null
                : !user
                  ? (
                    <LineButton
                      disabled
                      onClick={() => setLoginModalVisible(!loginModalVisible)}
                    >
                      Login/Register for NMC
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
                        // {
                        //   text: 'Payment',
                        //   onClick: '/payment',
                        // },
                        {
                          text: 'All attendees',
                          onClick: '/all-attendees',
                        },
                        {
                          text: 'Your matches',
                          onClick: '/your-matches',
                        },
                        // {
                        //   text: 'Feedback',
                        //   onClick: '/feedback',
                        // },
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
        </IndexNavbar>

        <Container noPadding={noPadding} css={containerStyle}>
          {children}
        </Container>

        {hideFooter
          ? null
          : <IndexFooter />}
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
