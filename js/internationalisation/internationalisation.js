// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int

const dtFmt = new Intl.DateTimeFormat(
  undefined, // locate: when undefined takes the selection from the browser
  {
    dateStyle: "full"
  }
);
console.log(dtFmt.format(new Date()));

const relDtFmt = new Intl.RelativeTimeFormat("el", { numeric: "auto" });
console.log(relDtFmt.format(45, "minutes"));
console.log(relDtFmt.format(-2, "day"));
console.log(relDtFmt.format(1, "day"));
console.log(relDtFmt.format(-3, "quarter"));

const curFmt = new Intl.NumberFormat(
  undefined,
  {
    currency: "GBP",
    style: "currency",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }
);
console.log(curFmt.format(27));

const unitFmt = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "liter"
});
console.log(unitFmt.format(20));

const numFmt = new Intl.NumberFormat("en-UK", {
  notation: "scientific"
});
console.log(numFmt.format(152000000));
