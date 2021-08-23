import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { basedStyles, media } from '../../../styles';
import { Fa } from '../../../utils';
import { LineButton } from '../../BaseComponents/Buttons';

// -- COMPONENTS
const DropdownWrapper = styled.div`
  position: relative;

  & > button {
    padding-right: 8px;
  }
`;

const DropdownItemsContainer = styled.ul`
  /* reset */
  margin: 0;
  padding: 0;

  position: absolute;
  top: 2.25rem;
  right: 0;

  list-style-type: none;
  background-color: ${p => p.theme.colors.primary};

  border: 1px solid ${p => p.theme.colors.secondary};
  border-radius: 2px;
  overflow: hidden;

  /* on navbar it is overlayed by other buttons */
  z-index: 1;

  /* center the dropdown box on mobile */
  ${media.medium`
    width: 150px;
    left: 50%;
    margin-left: -75px;
  `}
`;

const DropdownItemContainer = styled.li`
  /* reset */
  margin: 0 !important;
  padding: 0 12px;
  height: 45px;

  display: flex;

  white-space: nowrap;
  text-align: center;

  /* it is out of center in responsive */
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  ${basedStyles.interxEffect}

  /*
    On mobile, there is no actual :hover. The hover effect will show
    only after the user actually click, so just about the same as :active.
  */
  ${media.medium`
    padding: 0;
  `}
`;

const DropdownItem = styled(Link)`
  /* reset */
  margin: 0 !important;
  padding: 0;

  padding: 7px 20px;

  color: ${p => p.theme.colors.secondary};
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;

  /* for clicking */
  flex: 1;

  :hover, :focus, :active {
    text-decoration: none;
    outline: none;
  }

  :hover {
    color: ${p => p.theme.colors.accent};
  }
`;

/**
 * @typedef DropdownContent
 * @property {string} text
 * @property {function|string} onClick - string is binded with <Link>,
 * function is binded with <button>
 *
 * DropdownButton
 * @param {Object} props
 * @param {import('react').ReactChild} props.children
 * @param {DropdownContent[]} props.dropdownContent
 */
 const DropdownButton = ({
  children, dropdownContent, itemsContainerStyles, noButtonBorder,
}) => {
  const { ref: visibleRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  return (
    <DropdownWrapper ref={visibleRef}>
      <LineButton
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        noBorder={noButtonBorder}
      >
        {children}
        &nbsp;
        {
          isComponentVisible
            ? <Fa icon="caret-up" />
            : <Fa icon="caret-down" />
        }
      </LineButton>
      {
        isComponentVisible
          ? (
            <DropdownItemsContainer css={itemsContainerStyles}>
              {
                dropdownContent.map((item) => (
                  typeof item.onClick === 'string'
                    ? (
                      <DropdownItemContainer key={item.text}>
                        <DropdownItem to={item.onClick}>
                          {item.text}
                        </DropdownItem>
                      </DropdownItemContainer>
                    )
                    : typeof item.onClick === 'function'
                      ? (
                        <DropdownItemContainer key={item.text}>
                          <DropdownItem
                            as="button"
                            type="button"
                            onClick={item.onClick}
                          >
                            {item.text}
                          </DropdownItem>
                        </DropdownItemContainer>
                      )
                      : null
                ))
              }
            </DropdownItemsContainer>
          )
          : null
      }
    </DropdownWrapper>
  );
};

DropdownButton.propTypes = {
  children: PropTypes.string,
  dropdownContent: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
  })).isRequired,
  itemsContainerStyles: PropTypes.arrayOf(PropTypes.string),
  noButtonBorder: PropTypes.bool,
};

DropdownButton.defaultProps = {
  children: 'ok',
  buttonColorProps: {},
  itemsContainerStyles: undefined,
  noButtonBorder: false,
};

export default DropdownButton;
