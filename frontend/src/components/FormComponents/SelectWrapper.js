/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types"
import React from "react"
import { Controller } from "react-hook-form"
import BasedNoCreateSelect from "react-select"
import BasedAsyncSelect from "react-select/async-creatable"
import BasedSelect from "react-select/creatable"
import { useThemeContext } from "../../styles/themeContext"
import { color } from "../../utils"

// control select color and style here
const overrideColors = colors => ({
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? "rgba(239, 239, 239, 0.3)" : "white",
  }),
  placeholder: (styles, { isDisabled }) => ({
    ...styles,
    color: isDisabled ? "#bbb" : styles.color,
    opacity: isDisabled ? 0.54 : styles.opacity,
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
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled &&
          (isSelected
            ? colors.accent
            : color.transparentize(colors.accent, 0.5)),
      },
    }
  },
})

// -- WRAPPED BASED COMPONENTS
const AsyncSelect = props => {
  const { themeObject } = useThemeContext()

  return (
    <BasedAsyncSelect styles={overrideColors(themeObject.colors)} {...props} />
  )
}

const Select = props => {
  const { themeObject } = useThemeContext()

  return <BasedSelect styles={overrideColors(themeObject.colors)} {...props} />
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
 * @param {string=} props.isRequired
 * @param {import("react-select").CommonProps & import("react-select/src/Select").Props & import("react-select/src/Async").AsyncProps & import("react-select/creatable").CreatableProps} props.selectProps
 */
const AsyncControlSelect = ({ name, control, isRequired, selectProps }) => (
  <Controller
    as={
      <AsyncSelect
        cacheOptions
        openMenuOnClick={false}
        createOptionPosition="first"
        {...selectProps}
      />
    }
    control={control}
    onChange={([selected]) => selected}
    name={name}
    defaultValue={isRequired ? undefined : selectProps?.isMulti ? [] : ""}
    rules={{ required: isRequired }}
  />
)

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
  name,
  control,
  options,
  isMulti,
  placeholder,
  isRequired,
  disabled,
  components,
  allowCreate,
  ...restProps
}) => (
  <Controller
    as={
      allowCreate ? (
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
      )
    }
    control={control}
    onChange={([selected]) => selected}
    name={name}
    defaultValue={isRequired ? undefined : isMulti ? [] : ""}
    rules={{ required: isRequired }}
  />
)

ControlSelect.propTypes = {
  allowCreate: PropTypes.bool,
}

ControlSelect.defaultProps = {
  allowCreate: true,
}

export {
  AsyncControlSelect,
  ControlSelect,
  AsyncSelect,
  Select,
  NoCreateSelect,
}
