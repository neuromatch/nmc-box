/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async-creatable';
import Select from 'react-select/creatable';
import NoCreateSelect from 'react-select';
import { useFetchGet } from '../../hooks/useFetch';

// const handleInputChange = (newValue) => {
//   const inputValue = newValue.replace(/\W/g, '');
//   return inputValue;
// };

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

export { AsyncControlSelect, ControlSelect };
