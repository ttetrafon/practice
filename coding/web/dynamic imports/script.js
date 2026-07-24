const title = document.querySelector("title");
console.log(title.text + " script started...");

// Dynamic load gets only relevant parts of a module's code when they are needed
// instead of importing the full file at startup.
// Useful when:
// - code may not be needed at all in some cases (e.g.: admin functionality for a normal user).
// - code needs to run later and the flow may never reach there, so it should not be loaded at the front.
// - code needs to load only some times (e.g.: internationalisation strings).


import("./user.js").then(({ default: User, printUser }) => {
  var me = new User("t", "tetrafon", "la");
  printUser(me);
});

import(`./la-strings.js`)
  .catch(() => import('./en-strings.js'))
  .then(
    ({ default: strings }) => {
      console.log(strings.hi);
    }
);

const shapes = [
  { type: "rectangle" },
  { type: "triangle" },
  { type: "rectangle" }
];

shapes.forEach(async (shape) => {
  const { default: render } = await import(`./shape-${shape.type}.js`);
  render(shape);
});
