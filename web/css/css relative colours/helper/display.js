/**
 *
 * @param {Date} date
 * @returns {String} Format: DD/MM/YYYY
 */
export function displayDateAsDDMMYYYY(date) {
  let str = date.toISOString();
  return `${str.substring(8,10)}/${str.substring(5,7)}/${str.substring(0,4)}`;
}
/**
 *
 * @param {Date} date
 * @returns {String} Format: YYYY-MM-DD
 */
export function displayDateAsYYYYMMDD(date) {
  let str = date.toISOString();
  return `${str.substring(0,4)}-${str.substring(5,7)}-${str.substring(8,10)}`;
}

/**
 *
 * @param {timestamp} timestamp
 * @returns {String} Format: DD/MM/YYYY, HH:mm:ss
 */
export function displayTimeAsHoursMinutesSeconds(timestamp) {
  let then = new Date(timestamp);
  // 27/09/2024, 15:47:25
  return then.toISOString().substring(11, 19);
}

/**
 *
 * @param {timestamp} timestamp
 * @returns
 */
export function displayTimeAsLocaleString(timestamp) {
  let then = new Date(timestamp);
  let str = then.toISOString();
  // 2024-09-30T08:36:48.826Z
  return `${str.substring(8,10)}-${str.substring(5,7)}-${str.substring(0,4)} ${str.substring(11,19)}`;
}
