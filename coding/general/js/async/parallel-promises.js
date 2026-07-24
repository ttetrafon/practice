async function fetchUser(id) {
  if (id == 2) throw new Error("Unknown user!");
  return {
    id: id
  };
}

const users = [1, 2, 3];

// Promise.all rejects on the first error.
// Can use Promise.allSettled instead.

// const results = await Promise.all(users.map(id => fetchUser(id)));
// console.log(results);

const results = await Promise.allSettled(users.map(id => fetchUser(id)));


results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('✅ User:', result.value);
  } else {
    console.warn('❌ Error:', result.reason);
  }
});
