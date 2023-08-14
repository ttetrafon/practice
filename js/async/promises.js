// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

const promise = new Promise((resolve, reject) => {
  let n = Math.random();
  if (n >= 0.5) {
    resolve(1);
  }
  else {
    reject(0);
  }
});



promise.then(val => {
  console.log("promise resolved: ", val);
}).catch(err => {
  console.log("promise rejected: ", err);
});
console.log("just a synchronous log!");



const delayedPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 1000);
});
delayedPromise
  .then((value) => `${ value } and bar`)
  .then((value) => `${ value } and bar again`)
  .then((value) => `${ value } and again`)
  .then((value) => `${ value } and again`)
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.error(err);
  });



const THRESHOLD_A = 8; // can use zero 0 to guarantee error

function tetheredGetNumber(resolve, reject) {
  setTimeout(() => {
    const randomInt = Date.now();
    const value = randomInt % 10;
    if (value < THRESHOLD_A) {
      resolve(value);
    } else {
      reject(`Too large: ${ value }`);
    }
  }, 500);
}

function determineParity(value) {
  const isOdd = value % 2 === 1;
  return { value, isOdd };
}

function troubleWithGetNumber(reason) {
  const err = new Error("Trouble getting number", { cause: reason });
  console.error(err);
  throw err;
}

function promiseGetWord(parityInfo) {
  return new Promise((resolve, reject) => {
    const { value, isOdd } = parityInfo;
    if (value >= THRESHOLD_A - 1) {
      reject(`Still too large: ${ value }`);
    } else {
      parityInfo.wordEvenOdd = isOdd ? "odd" : "even";
      resolve(parityInfo);
    }
  });
}

new Promise(tetheredGetNumber)
  .then(determineParity, troubleWithGetNumber)
  .then(promiseGetWord)
  .then((info) => {
    console.log(`Got: ${ info.value }, ${ info.wordEvenOdd }`);
    return info;
  })
  .catch((reason) => {
    if (reason.cause) {
      console.error("Had previously handled error");
    } else {
      console.error(`Trouble with promiseGetWord(): ${ reason }`);
    }
  })
  .finally((info) => console.log("All done"));

// Concurrency:
// - Promise.all(): fulfils when all promises fulfilled, rejects when any of the promises rejects
// - Promise.allSettled(): fulfils when all promises has settled
// - Promise.any(): fulfils when any of the promises fulfils, rejects when all the promises reject
// - Promise.race(): settles when any of the promises settles

