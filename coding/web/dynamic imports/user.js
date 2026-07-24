export default class User {
  constructor(first, last, locale) {
    this.first = first;
    this.last = last;
    this.locale = locale;
  }
};

export function printUser(user) {
  console.log(`${user.first} ${user.last} [${user.locale}]`);
}

export function greetUser(user, salutation) {
  console.log(`${salutation} ${user.last}`);
}
