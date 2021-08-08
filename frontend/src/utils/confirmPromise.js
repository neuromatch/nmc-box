// built-in confirm() wrapped in promise
const confirmPromise = (msg) => new Promise((res, rej) => {
  // eslint-disable-next-line no-alert
  const confirmed = window.confirm(msg);

  return confirmed ? res(true) : rej();
});

export default confirmPromise;
