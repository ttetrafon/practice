// `for await ...of` can be used to run async tasks in order, like with generator functions

async function* foo() {
  yield 1;
  yield 2;
  yield 3;
}

(async function() {
  for await (const num of foo()) {
    console.log(num);
  }
})();

// --------------------------------------------------------
// ... or html requests

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    fetch(`api/users/${id}.json`).then(response => {
      return response.json();
    }).then(user => {
      setTimeout(() => {
        resolve(user);
      }, 1000);
    });
  });
}

const usersToFetch = [
  fetchUser(13425),
  fetchUser(26643),
  fetchUser(36238)
];

async function main() {
  // This will force the list above to finish all async computations before moving on!
  for await (const user of usersToFetch) {
    console.log(user);
  }
}

main();
