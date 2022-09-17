console.log("main script started...");

document.addEventListener("visibilitychange", () => {
  console.log(`visibility changed: '${ document.visibilityState }'`);
});

const quoteElement = document.getElementById("quote");
const counterElement = document.getElementById("counter");
const shareButton = document.getElementById("share-button");

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

const shareQuote = async (shareData) => {
  try {
    // Available only in secure context (https, wss, etc).
    await navigator.share(shareData);
  } catch (error) {
    console.error(error);
  }
};

shareButton.addEventListener("click", () => {
  let shareData = {
    title: "A Beautiful Quote",
    text: quote.textContent,
    url: location.href,
  };
  shareQuote(shareData);
});

getQuote();

setInterval(getQuote, 10000);
