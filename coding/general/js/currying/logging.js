const log = (prefix) => (message) => console.log(`${prefix}: ${message}`);

const infoLog = log("INFO");
const errorLog = log("ERROR");

log("DEBUG")("Server Staring");
infoLog("Server Started");
errorLog("Server Crashed");
