const resultEl = document.querySelector(".js-result");
const movesEl = document.querySelector(".js-moves");
const scoreEl = document.querySelector(".js-score");

const rockBtn = document.querySelector(".js-rock-button");
const paperBtn = document.querySelector(".js-paper-button");
const scissorsBtn = document.querySelector(".js-scissors-button");
const resetBtn = document.querySelector(".js-reset-button");
const autoPlayBtn = document.querySelector(".js-autoPlay-button");

const score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  ties: 0,
};

updateScoreElement();

rockBtn.addEventListener("click", () => {
  playGame("Rock");
});

paperBtn.addEventListener("click", () => {
  playGame("Paper");
});
scissorsBtn.addEventListener("click", () => {
  playGame("Scissors");
});

let isAutoPlaying = false;
let intervalId;

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    autoPlayBtn.textContent = "Stop auto play";
    setManualControl(false);
  } else {
    clearInterval(intervalId);
    intervalId = null;
    isAutoPlaying = false;

    autoPlayBtn.textContent = "Auto play";
    setManualControl(true);
    movesEl.textContent = movesEl.textContent.replace(
      " (Auto play is running)",
      ""
    );
  }
}

autoPlayBtn.addEventListener("click", autoPlay);

function setManualControl(enabled) {
  rockBtn.disabled = !enabled;
  paperBtn.disabled = !enabled;
  scissorsBtn.disabled = !enabled;
}

resetBtn.addEventListener("click", () => {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;

  localStorage.removeItem("score");
  updateScoreElement();

  resultEl.textContent = "First Round!";
  movesEl.textContent = "Choose your move!";
  if (isAutoPlaying) {
    clearInterval(intervalId);
    intervalId = null;
    isAutoPlaying = false;
    autoPlayBtn.textContent = "Auto play";
    setManualControl(true);
  }
});

const keyToMove = Object.freeze({
  r: "Rock",
  p: "Paper",
  s: "Scissors",
});

function handleKeyDown(event) {
  if (isAutoPlaying) return;
  const key = event.key.toLowerCase();
  if (event.ctrlKey || event.metaKey) return;

  const move = keyToMove[key];
  if (move) playGame(move);
}

document.addEventListener("keydown", handleKeyDown);

function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = "";
  if (playerMove === computerMove) {
    result = "Tie";
    score.ties += 1;
  } else if (
    (playerMove === "Paper" && computerMove === "Rock") ||
    (playerMove === "Rock" && computerMove === "Scissors") ||
    (playerMove === "Scissors" && computerMove === "Paper")
  ) {
    result = "You win";
    score.wins += 1;
  } else {
    result = "You lose";
    score.losses += 1;
  }

  localStorage.setItem("score", JSON.stringify(score));
  updateScoreElement();

  resultEl.textContent = result;
  const pickerText = isAutoPlaying ? "Auto chose" : "You pick";
  movesEl.textContent =
    `${pickerText}: ${playerMove} - Computer: ${computerMove}` +
    (isAutoPlaying ? " (Auto play is running)" : "");
}

function updateScoreElement() {
  scoreEl.textContent = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();

  let computerMove = "";

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = "Rock";
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = "Paper";
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = "Scissors";
  }

  return computerMove;
}
