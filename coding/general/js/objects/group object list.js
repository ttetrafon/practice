// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy

const users = [
  {
    "name": "John",
    "joined": 2015
  },
  {
    "name": "Natalie",
    "joined": 2018
  },
  {
    "name": "Gregory",
    "joined": 2015
  },
  {
    "name": "Dom",
    "joined": 2022
  },
  {
    "name": "Max",
    "joined": 2018
  }
];

console.log(
  // Available on node 21
  Object.groupBy(users, (obj) => { return users.joined; })
);
