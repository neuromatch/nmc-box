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

/**
 * scrollTo - a wrapper for window.scrollTo(),
 * default to scroll to top of the screen
 * @param {Number} top - px to scroll to vertically
 * @param {Number} left - px to scroll to horizontally
 */
const scrollTo = (top = 0, left = 0) => {
  if (window) {
    window.scrollTo({
      top,
      left,
      behavior: 'smooth',
    })
  }
}

/**
 * scrollBy - a wrapper for window.scrollBy(),
 * default to not scroll
 * @param {Number} top - px to scroll by vertically
 * @param {Number} left - px to scroll by horizontally
 */
const scrollBy = (top = 0, left = 0) => {
  if (window) {
    window.scrollBy({
      top,
      left,
      behavior: 'smooth',
    });
  }
}

export default {
  encodeBase64,
  decodeBase64,
  flat,
  scrollTo,
  scrollBy,
};
