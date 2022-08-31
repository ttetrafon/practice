// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

let game = {
  status: "In Progress",
  scoreHistory: [4, 1, 8, 2]
};

Object.defineProperty(
  game,
  "maxPlayers",
  {
    value: 2,
    writable: false,
    enumerable: true
  }
);

Object.defineProperty(
  game,
  "highScore",
  {
    get() {
      return Math.max(...this.scoreHistory);
    }
  }
);

Object.defineProperty(
  game,
  "completed",
  {
    set(value) {
      if (value) {
        this.status = "Completed";
      }
    }
  }
);

console.log("game", game);
console.log("game.maxPlayers", game.maxPlayers);
console.log("game.highScore (old)", game.highScore);
game.scoreHistory.push(11);
game.scoreHistory.push(3);
game.scoreHistory.push(9);
console.log("game", game);
console.log("game.highScore (new)", game.highScore);
game.completed = true;
console.log("game", game);
