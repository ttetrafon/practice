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

let prop1 = "contact.email.work".split('.');
let prop2 = "contact.email.work".split('.');

function get(obj, prop) {
  if (prop.length == 0) return obj;
  else return get(obj[prop.shift()], prop);
}
let res = get(user, prop1);
console.log("... got: ", res);

function update(obj, prop, value) {
  if (prop.length == 1) {
    obj[prop] = value;
  }
  else return update(obj[prop.shift()], prop, value);
}
update(user, prop2, 'new-email@mail.com');
console.log(user);
