const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require ('path');
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});
