console.log("main script started...");

const quoteElement = document.getElementById("quote");
const counterElement = document.getElementById("counter");
const getQuoteButton = document.getElementById("get-quote");
// Create a broadcast channel to be used within the browser.
const broadcast = new BroadcastChannel("quote-channel");
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

      broadcast.postMessage({
        type: "quote",
        message: parsedQuote
      });
    }
    catch (exc) {
      console.log(`exception encountered getting a quote: '${ exc }'`);
    }
  }
};


broadcast.onmessage = ({ data }) => {
  console.log(`got a 'quote-channel' message: ${ JSON.stringify(data) }`);
  if (data.type === 'quote') {
    counter++;
    quoteElement.innerHTML = data.message;
    counterElement.innerText = `Total number of quotes shown: ${ counter }`;
  }
  else {
    console.warn("unknown message type!");
  }
};

getQuoteButton.addEventListener("click", () => {
  getQuote();
});
