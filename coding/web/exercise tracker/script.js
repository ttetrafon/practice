import WorkoutTracker from './WorkoutTracker.js';
// console.log("main script started...");

const app = document.getElementById("app");
const wt = new WorkoutTracker(app);
window.wt = wt;
