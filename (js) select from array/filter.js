reasonCodesArray = [
    {
        ReasonCodeDescription: "Updating transaction status to Released",
        ReasonCodeExpires: null,
        ReasonCodeId: 1,
        ReasonCodeName: "R1"
    },
    {
        ReasonCodeDescription: "Updating transaction status to Suspended",
        ReasonCodeExpires: null,
        ReasonCodeId: 2,
        ReasonCodeName: "S1"
    },
    {
        ReasonCodeDescription: "Updating transaction status to Blocked",
        ReasonCodeExpires: null,
        ReasonCodeId: 3,
        ReasonCodeName: "B1"
    }
];

console.log(
    reasonCodesArray.filter(x => { return x.ReasonCodeName[0] === 'B' })
);
