const MAGIC_NUMBER = 9;

const encodeBase64 = (str, n = MAGIC_NUMBER) => {
  const b64 = btoa(str);
  const swap = `${b64.slice(n)}${b64.slice(0, n)}`;

  return swap;
};

const decodeBase64 = (b64, n = MAGIC_NUMBER) => {
  const swap = `${b64.slice(-n)}${b64.slice(0, -n)}`;

  const str = atob(swap);
  return str;
};

// https://1loc.dev/#flatten-an-array
const flat = (arr) => arr.reduce((a, b) => (
  Array.isArray(b) ? [...a, ...flat(b)] : [...a, b]
), []);

export default {
  encodeBase64,
  decodeBase64,
  flat,
};
