import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AbstractDetail from '../../../components/AgendaComponents/AbstractDetail';
import { LineButton } from '../../../components/BaseComponents/Buttons';
import useKeyPress from '../../../hooks/useKeyPress';
import Fa from '../../../utils/fontawesome';

// -- STYLES
// this should block scrolling when modal is visible
const GlobalStyle = createGlobalStyle`
  html {
    overflow-y: hidden;
  }
`;

// -- COMPONENTS
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0,0,0,0.25);
`;

const Modal = styled.div`
  width: 800px;
  max-height: 90vh;

  background-color: white;
  border-radius: 6px;

  padding: 20px;
  padding-bottom: 30px;

  -webkit-box-shadow: 0px 0px 23px 0px rgba(110,110,110,1);
  -moz-box-shadow: 0px 0px 23px 0px rgba(110,110,110,1);
  box-shadow: 0px 0px 23px 0px rgba(110,110,110,1);

  position: relative;
`;

const ModalCloseButton = styled(LineButton).attrs(() => ({
  color: '#ee1133',
}))`
  position: absolute;
  top: 10px;
  right: 10px;

  border-radius: 9999px;
  border-width: 2px;

  background-color: white;

  /* make the button as round as possible */
  padding: 7px 10px;
  line-height: 0;
`;

const AbstractModal = ({
  data, visible, handleClickClose, timezone,
}) => {
  // allow closing modal by pressing ESC
  const escPress = useKeyPress('Escape');
  const memoizedCloseModal = useCallback(() => handleClickClose(), [handleClickClose]);

  useEffect(() => {
    if (escPress) {
      memoizedCloseModal();
    }
  }, [escPress, memoizedCloseModal]);

  // add google calendar sync button
  // style author-coauthors
  // add abstract label (bold)
  return visible
    ? (
      <Container>
        <GlobalStyle />
        <Modal>
          <ModalCloseButton
            onClick={handleClickClose}
          >
            <Fa size="lg" icon="times" />
          </ModalCloseButton>
          <AbstractDetail
            data={data}
            timezone={timezone}
          />
        </Modal>
      </Container>
    )
    : null;
};

AbstractModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  handleClickClose: PropTypes.func,
  data: PropTypes.shape({
    title: PropTypes.string,
    abstract: PropTypes.string,
  }),
  timezone: PropTypes.string.isRequired,
};

AbstractModal.defaultProps = {
  handleClickClose: () => {},
  data: {},
};

export default AbstractModal;
