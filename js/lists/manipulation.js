var list = ["login", "weekly"];
console.log("list (initial): ", list);

var events = [
    {request: "change", toggle: true},
    {request: "login", toggle: false},
];

for (var i = 0; i < events.length; i++) {
    console.log("\n--------------------");
    console.log("event: ", events[i]);
    var ev = events[i];
    if (ev.toggle) {
        if (!list.includes(ev.request)) {
            list.push(ev.request);
        }
    }
    else {
        var index = list.indexOf(ev.request);
        if (index >= 0) {
            list.splice(index, 1);
        }
    }
    console.log('list: ', list);
}
