/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import BasedAsyncSelect from 'react-select/async-creatable';
import BasedSelect from 'react-select/creatable';
import BasedNoCreateSelect from 'react-select';
import { useFetchGet } from '../../hooks/useFetch';
import { color } from '../../utils';
import { useThemeContext } from '../../styles/themeContext';

// control select color and style here
const overrideColors = (colors) => ({
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? 'rgba(239, 239, 239, 0.3)' : 'white',
  }),
  placeholder: (styles, { isDisabled }) => ({
    ...styles,
    color: isDisabled ? '#bbb' : styles.color,
    opacity: isDisabled ? .54 : styles.opacity,
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? colors.disabled
        : isSelected
          ? colors.accent
          : isFocused
            ? color.transparentize(colors.accent, 0.3)
            : null,
      color: isDisabled
        ? color.scale(colors.grey, 30)
        : isSelected
          ? color.contrast(colors.accent)
          : colors.black,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled && (isSelected ? colors.accent : color.transparentize(colors.accent, 0.5)),
      },
    };
  },
});

// -- WRAPPED BASED COMPONENTS
const AsyncSelect = props => {
  const { themeObject } = useThemeContext()

  return (
    <BasedAsyncSelect styles={overrideColors(themeObject.colors)} {...props} />
  )
}

const Select = props => {
  const { themeObject } = useThemeContext()

  return <BasedSelect  styles={overrideColors(themeObject.colors)} {...props} />
}

const NoCreateSelect = props => {
  const { themeObject } = useThemeContext()

  return (
    <BasedNoCreateSelect
      styles={overrideColors(themeObject.colors)}
      {...props}
    />
  )
}

/**
 * AsyncControlSelect: a select component that fetches suggestion to display as user type
 * @param {Object} props
 * @param {string} props.name
 * @param {Object} props.control
 * @param {string} props.fetchUrl
 * @param {boolean=} props.isMulti
 * @param {string=} props.placeholder
 * @param {string=} props.isRequired
 * @param {string=} props.menuPlacement
 * @param {boolean=} props.disabled
 */
const AsyncControlSelect = ({
  name, control, fetchUrl, isMulti, placeholder, isRequired, menuPlacement, disabled,
}) => {
  const [searchQuery, setSearchQuery] = useState(undefined);
  const [options, setOptions] = useState([]);

  // fetch from elasticsearch
  useFetchGet(
    searchQuery ? `${fetchUrl}${encodeURI(searchQuery)}` : undefined,
    [],
    useCallback((resJson) => {
      // convert to a form that react-select can read
      const selectOptions = resJson.map((x) => ({
        value: x,
        label: x,
      }));

      setOptions(selectOptions);
    }, []),
  );

  return (
    <Controller
      as={(
        <AsyncSelect
          cacheOptions
          isMulti={isMulti}
          loadOptions={(inputValue, callback) => {
            setSearchQuery(inputValue);
            callback(options);
          }}
          openMenuOnClick={false}
          placeholder={placeholder}
          menuPlacement={menuPlacement}
          createOptionPosition="first"
          isDisabled={disabled}
        />
      )}
      control={control}
      onChange={([selected]) => selected}
      name={name}
      defaultValue={
        isRequired
          ? undefined
          : isMulti
            ? [] : ''
      }
      rules={{ required: isRequired }}
    />
  );
};

/**
 * @typedef Option
 * @property {string} value
 * @property {string} label
 *
 * AsyncControlSelect: a static select component that wraps react-select
 * @param {Object} props
 * @param {string} props.name
 * @param {Object} props.control
 * @param {Option[]=} props.options - can be omitted when use with `isMulti`
 * to be multiple string input
 * @param {boolean=} props.isMulti
 * @param {string=} props.placeholder
 * @param {string=} props.isRequired
 * @param {boolean=} props.disabled
 * @param {Object=} props.components
 * @param {boolean} props.allowCreate
 */
const ControlSelect = ({
  name, control, options, isMulti, placeholder, isRequired,
  disabled, components, allowCreate, ...restProps
}) => (
  <Controller
    as={allowCreate ? (
      <Select
        isMulti={isMulti}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        components={components || {}}
        {...restProps}
      />
    ) : (
      <NoCreateSelect
        isMulti={isMulti}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        components={components || {}}
        {...restProps}
      />
    )}
    control={control}
    onChange={([selected]) => selected}
    name={name}
    defaultValue={
      isRequired
        ? undefined
        : isMulti
          ? []
          : ''
    }
    rules={{ required: isRequired }}
  />
);

ControlSelect.propTypes = {
  allowCreate: PropTypes.bool,
};

ControlSelect.defaultProps = {
  allowCreate: true,
};

export { AsyncControlSelect, ControlSelect, AsyncSelect, Select, NoCreateSelect };
