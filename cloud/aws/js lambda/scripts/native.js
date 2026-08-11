/**
 * Run the Node application as a native local server without a lambda wrapper
 */

//The application to be run
const app = require('../service');
//The port on which it should appear
const port = 5050;

//Start the application
app.listen(port);
console.log(`listening on http://localhost:${port}`);
