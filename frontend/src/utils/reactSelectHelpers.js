// functions to transform data shape between
// react-select shape and save to db shape
const optionsToSaveFormat = (val) => {
  // for isMulti
  if (Array.isArray(val)) {
    return val.map((k) => k.value);
  }

  return val.value;
};

const saveFormatToOptions = (val) => {
  // for isMulti
  if (Array.isArray(val)) {
    return val.map((k) => ({ value: k, label: k }));
  }

  return { value: val, label: val };
};

export default {
  optionsToSaveFormat,
  saveFormatToOptions,
};
