console.log("main script started...");
const isDarkMode = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark").matches;

console.log("dark mode: " + isDarkMode());
