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

let prop = "contact.email.work".split('.');
console.log(prop);

function get(obj, prop) {
  if (prop.length == 0) return obj;
  else return get(obj[prop.shift()], prop);
}
let res = get(user, prop);
console.log("... got: ", res);