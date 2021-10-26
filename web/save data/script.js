var state = {
    name: "",
    age: 0
}

function SaveData() {
    console.log("---> SaveData()");
    console.log(state);
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(state, null, 2)], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
}

function UpdateName() {
    console.log("---> UpdateName()");
    state.name = document.getElementById("input_name").value;
}

function UpdateAge() {
    console.log("---> UpdateAge()");
    state.age = Number(document.getElementById("input_age").value);
}

function LoadData() {
    console.log("---> LoadData()");

}

document.querySelector("#function").addEventListener("click", SaveData);
document.querySelector("#input_name").addEventListener("change", UpdateName);
document.querySelector("#input_age").addEventListener("change", UpdateAge);
document.querySelector("#function").addEventListener("click", LoadData);
