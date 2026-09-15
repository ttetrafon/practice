
err = [
  new Error('oops'),
  new TypeError('bad type'),
  { message: 'fake error' },
  'not an error'
];

err.map((e) => console.log(e, "::", Error.isError(e)));