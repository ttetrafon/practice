console.log("main script started...");

let btn = document.getElementById("btn-copy");
// console.log(btn);

const copyToClipboard = (text) => navigator.clipboard?.writeText && navigator.clipboard.writeText(text);
btn.onclick = () => {
    console.log("button clicked!");
    let text = document.getElementById("text");
    copyToClipboard(text.innerText);
}
