weeks = [
    ["Week 7 August to 13 August 2020", 1599464692582, 1599983092582],
    ["Week 31 July to 6 August 2020", 1598859892582, 1599378292582 ],
    ["Week 24 July to 30 July 2020", 1598255092582, 1598773492582 ],
    ["Week 17 July to 23 July 2020", 1597650292582, 1598168692582 ]
]

option = "Week 24 July to 30 July 2020";

console.log(weeks.find((elem) => { return elem[0] === option }));
