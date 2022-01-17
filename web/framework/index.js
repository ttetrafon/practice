import { init } from "./init.js";
import { div } from "./element.js";

const firstName = "T";
const lastName = "T";

init("#app", div`Hello ${firstName} ${lastName}`);
