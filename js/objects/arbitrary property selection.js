let user = {
  username: "ttetrafon",
  contact: {
    email: {
      personal: "ttetrafon@yahoo.gr",
      work: "ttetrafon@gmail.gr"
    },
    tel: "+123456789"
  }
}

let target = "contact.email.personal".split('.');

function get(obj, prop) {
  if (prop.length == 0) return obj;
  else return get(obj[prop.shift()], prop);
}
let res = get(user, target);
console.log("... got: ", res);

function update(obj, prop, value) {
  if (prop.length == 1) {
    obj[prop] = value;
  }
  else return update(obj[prop.shift()], prop, value);
}
update(user, target, 'new-email@mail.com');
console.log(user);

function remove(obj, prop, value) {
  if (prop.length == 1) {
    delete obj[prop];
  }
  else return remove(obj[prop.shift()], prop, value);
}
remove(user, target, 'new-email@mail.com');
console.log(user);
