function* generator_func() {
    console.log("before 1");
    yield 1;
    console.log("after 1");
    console.log("before 2");
    yield 2;
    console.log("after 2");
    console.log("before 3");
    yield 3;
    console.log("after 3");
}

const generator = generator_func();
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());

//------------------------------------------------//
function* id_generator_fun() {
    var id = 0;
    while(true) {
        yield {id: id};
        id++;
    }
}

const id_generator = id_generator_fun();
for (var i = 0; i < 10; i++) {
    console.log(id_generator.next());
}
