console.log("main script started...");

document.addEventListener("visibilitychange", () => {
  console.log(`visibility changed: '${ document.visibilityState }'`);
});

let quoteElement = document.getElementById("quote");
let counterElement = document.getElementById("counter");
let counter = 0;

const getQuote = async () => {
  // Only fetch quotes while the window is visible.
  if (document.visibilityState === 'visible') {
    counter++;
    console.log(`---> getQuote(${ counter })`);
    try {
      const response = await fetch("https://api.quotable.io/random");
      const { content, author, dateAdded } = await response.json();
      const parsedQuote = `<q>${ content }</q><p>- ${ author }</p><p>Added on ${ dateAdded }</p>`;
      quoteElement.innerHTML = parsedQuote;

      counterElement.innerText = `Total number of quotes shown: ${ counter }`;
    }
    catch (exc) {
      console.log(`exception encountered getting a quote: '${ exc }'`);
    }
  }
};

getQuote();

setInterval(getQuote, 1000);
