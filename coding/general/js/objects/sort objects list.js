let list = [
    {
        "who": "Babis",
        "how": 51
    },
    {
        "who": "Maria",
        "how": 44
    },
    {
        "who": "Kostas",
        "how": 81
    }
];

function compare(a, b) {
    if (a.who < b.who) {
        return -1;
    }
    if (a.who > b.who) {
        return 1;
    }
    return 0;
};

// console.log(list.sort(compare));

function dynamicSort(property, direction) {
    // property: name of object key to use
    // direction: 'asc' (default)(/'desc'
    var sortOrder = direction == 'desc' ? -1 : 1;
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
};

console.log(list.sort(dynamicSort("how", "desc")));
