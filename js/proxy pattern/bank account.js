// Your account
var account = {
	balance: 5000
}

// A bank acts like a proxy between you and your bank account
var bank = new Proxy(account, {
    get: function (target, prop) {
    	return 9000000;
        // return account.balance;
    }
});

console.log("account.balance:", account.balance);   // real amount
console.log("bank.balance:", bank.balance);         // the bank lies
console.log("bank.currency:", bank.currency);       // the bank says whatever
