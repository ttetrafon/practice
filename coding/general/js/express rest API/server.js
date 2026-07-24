import express from "express";
// https://expressjs.com/en/starter/examples.html

const app = express();
const port = 3000;

app.get('/', (request, response) => {
    console.log("get request received: ", request);
    response.send("Hello World!");
});

app.post('/', (request, response) => {
    console.log("post request received: ", request);
    response.send("Hello World!");
});

app.put('/', (request, response) => {
    console.log("put request received: ", request);
    response.send("Hello World!");
});

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
