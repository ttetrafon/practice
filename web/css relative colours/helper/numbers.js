export function roundToTwoDecimals(num) {
  if (!num) {
    return 0;
  }
  else if (num === Infinity) {
    return 0;
  }
  else if (num === (-Infinity)) {
    return 0;
  }
  return num.toFixed(2);
}

export function roundToInteger(num) {
  if (!num) {
    return 0;
  }
  else if (num === Infinity) {
    return 0;
  }
  else if (num === (-Infinity)) {
    return 0;
  }
  return num.toFixed(0);
}

export function addLeadingPositiveSign(num) {
  return num > 0 ? `+${num}` : `${num}`
}
