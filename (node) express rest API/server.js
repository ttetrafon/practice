const express = require("express");
const app = express();
const port = 3000;

app.get('/', (request, response) => {
    console.log("get request received: ", request);
    response.send("Hello World!");
});

app.post('/', (request, resposne) => {
    console.log("post request received: ", request);
    resposne.send("Hello World!");
});

app.put('/', (request, response) => {
    console.log("put request received: ", request);
    response.send("Hello World!");
});

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
