function DisplayRemainingTime(time) {
    let noMs = Math.floor(time/1000);
    let hours = Math.floor(noMs / 60 / 60);
    let minutes = Math.floor(noMs / 60) - (hours * 60);
    let seconds = Math.floor(noMs) - (hours * 60 * 60) - (minutes * 60);
    return (hours > 0 ? hours : "00")
      + ":"
      + (minutes > 0 ? (minutes >= 10 ? minutes : "0" + minutes) : "00")
      + ":"
      + (seconds > 0 ? (seconds >= 10 ? seconds : "0" + seconds) : "00");

}

console.log(DisplayRemainingTime(1 * 60 * 60 * 1000 + 10 * 60 * 1000 + 25 * 1000 + 561));
