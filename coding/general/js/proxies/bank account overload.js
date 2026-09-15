// Your account
var account = {
  balance: 5000
}

// A bank acts like a proxy between you and your bank account
var bank = new Proxy(account, {
  get: function (target, prop) {
    return account.balance;
  },
  // Set is overloaded to always assign 1 to account.balance.
  set: function(target, prop, value) {
    return Reflect.set(target, prop, 1);
  }
});

account.balance = 6000;
console.log("account.balance:", account.balance);   // real amount

bank.balance = 7500;
console.log("bank.balance:", bank.balance);         // the bank lies
