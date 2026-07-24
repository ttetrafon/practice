var offices = [{OfficeName: 'Office 1'}, {OfficeName: 'Office 2'}, {OfficeName: 'Office 3'}];
console.log(
    offices.map((elem) => { return elem["OfficeName"] })
);

var releaseDates = {
    1037:'2021-04-04',
    1039:'2021-04-04',
    1041:'2021-04-04'
}
console.log(
    Object.keys(releaseDates).map((el) => { return "when " + el + " then " + releaseDates[el]; })
);
