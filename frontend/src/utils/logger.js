/**
 * warn - warn should be used instead of logged if there is something wrong
 * @param {string} funcName - name of the function to be logged
 * @param {string} msg - message to be printed out
 */
function warn(funcName, msg) {
  console.warn(`[${funcName}] ${msg}`);
}

/**
 * log - log should be used to print the information
 * @param {string} funcName - name of the function to be logged
 * @param {string} msg - message to be printed out
 */
function log(funcName, msg) {
  console.warn(`[${funcName}] ${msg}`);
}

/**
 * log - log should be used to print the information
 * @param {string} funcName - name of the function to be logged
 * @param {string} msg - message to be printed out
 */
function error(funcName, msg) {
  throw new Error(`[${funcName}] ${msg}`);
}

export default {
  warn, log, error,
};
