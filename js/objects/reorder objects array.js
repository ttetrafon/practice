let arr = [
  {
    uid: "0f6bd3dd-128e-402e-93a0-6518cddc9132",
    text: "Apple"
  },
  {
    uid: "036e032b-080a-4550-a378-cd0da2224284",
    text: "Orange"
  },
  {
    uid: "a15ebbd7-3a94-431c-9c47-acc2cbf10dcc",
    text: "Watermelon"
  }
];

let newOrder = ["Watermelon", "Apple", "Orange"];

let newArr = [];
newOrder.forEach(item => {
  newArr.push(
    arr.find(el => el.text == item)
  );
});

console.log(arr, "-->", newArr);
