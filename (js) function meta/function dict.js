function a() {
    console.log('function a!');
}

function b() {
    console.log('function b!');
}

var data = {
    "a": a,
    "b": b,
    "c": a
};

var arr = ['a', 'a', 'b', 'c', 'c', 'b'];
for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]);
    data[arr[i]]();
}
