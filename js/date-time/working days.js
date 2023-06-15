function formatDateForSql(datetime) {
    var date = new Date(datetime);
    return new Date(date).toISOString().slice(0, 10);
}

function advanceWorkDays(start, advance) {
    let st = new Date(Date.parse(start));
    let i = 0;
    let n;
    while (i <= advance) {
        n = st.setDate(st.getDate() + 1);
        let wd = st.getDay();
        if (wd >= 1 && wd <= 5) {
            i++;
        }
    }
    console.log(n);
    return n;
}

console.log(
    formatDateForSql(
        advanceWorkDays(new Date(), 5)
    )
);
