//
var filenames = [
    'Pivotal_Monthly_InterchangePlusPlusReport_34_Revolution Fitness_CARD_July_2020.pdf',
    'Pivotal_Monthly_ActivityBreakDown_34_Revolution Fitness_CARD_07-07-2020.xlsx',
    'Pivotal_Monthly_ActivityReport_34_Revolution Fitness_CASH_July_2020.pdf',
    'Pivotal_Monthly_ActivityBreakDown_34_Revolution Fitness_CASH_07-07-2020.xlsx',
    'Pivotal_Monthly_ActivityBreakDown_34_Revolution Fitness_CARD_02-07-2020.xlsx',
    'Pivotal_Monthly_ActivityBreakDown_34_Revolution Fitness_CASH_02-07-2020.xlsx'
];

for (var i = 0; i < filenames.length; i++) {
    console.log('------------------------------------');
    let file = filenames[i];
    console.log(file)
    let parts = file.split('_');
    console.log(parts);
    let len = parts.length;
    let name = parts[len-3] + '; ' + parts[len-2] + ', ' + parts[len-1];
    console.log(name);
}
