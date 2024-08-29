const board = document.querySelector(".board");
const timerInput = document.getElementById("timer-input");
const whitePerspectiveButton = document.getElementById("white-perspective");
const blackPerspectiveButton = document.getElementById("black-perspective");
const timeLeftDisplay = document.getElementById("time-left");
const startGameButton = document.getElementById("start-game");
const msgBox = document.getElementById("msg-box");
const target = document.getElementById("target-square");
const correctCounter = document.getElementById("correct");
const wrongCounter = document.getElementById("wrong");
const gameOver = document.querySelector(".game-over");

gameOver.style.display = "none";
updateCursor("white");

let whiteIsSelected = true;
let find;
let currentAnnotation;
let correctGuesses = 0;
let wrongGuesses = 0;

let timer = 0;
let timerInterval;
const whitePerspective = [
  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
  ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
  ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
  ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
  ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"],
];

const blackPerspective = [
  ["h1", "g1", "f1", "e1", "d1", "c1", "b1", "a1"],
  ["h2", "g2", "f2", "e2", "d2", "c2", "b2", "a2"],
  ["h3", "g3", "f3", "e3", "d3", "c3", "b3", "a3"],
  ["h4", "g4", "f4", "e4", "d4", "c4", "b4", "a4"],
  ["h5", "g5", "f5", "e5", "d5", "c5", "b5", "a5"],
  ["h6", "g6", "f6", "e6", "d6", "c6", "b6", "a6"],
  ["h7", "g7", "f7", "e7", "d7", "c7", "b7", "a7"],
  ["h8", "g8", "f8", "e8", "d8", "c8", "b8", "a8"],
];

function drawChessBoard(perspective) {
  board.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    let row = perspective[i];
    for (let u = 0; u < row.length; u++) {
      const square = document.createElement("div");
      let squareColor = (i + u) % 2 === 0 ? "white" : "black";
      square.className = "square " + squareColor;
      let annotation = perspective[i][u];
      square.addEventListener("click", () => {
        handelSquareClick(annotation, timer);
      });
      square.textContent = perspective[i][u];
      square.id = perspective[i][u];
      board.appendChild(square);
    }
  }
}

drawChessBoard(whitePerspective);

whitePerspectiveButton.addEventListener("click", () => {
  if (timer === 0) {
    rotateBoard();
    gameOver.style.display = "none";
    whitePerspectiveButton.classList.add("selected");
    blackPerspectiveButton.classList.remove("selected");
    updateCursor("white");

    setTimeout(() => {
      drawChessBoard(whitePerspective);
    }, 100);
    whiteIsSelected = true;
  }
});

blackPerspectiveButton.addEventListener("click", () => {
  if (timer === 0) {
    rotateBoard();
    gameOver.style.display = "none";
    blackPerspectiveButton.classList.add("selected");
    whitePerspectiveButton.classList.remove("selected");
    updateCursor("black");
    setTimeout(() => {
      drawChessBoard(blackPerspective);
    }, 100);

    whiteIsSelected = false;
  }
});

startGameButton.addEventListener("click", () => {
  StartGame();
});

function StartGame() {
  gameOver.style.display = "none";
  msgBox.innerText = "";
  resetCounters();
  startGameButton.innerText = "Restart Game";
  timer = parseInt(timerInput.value);

  if (timer === 0 || isNaN(timer)) {
    createMsg(msgBox, "Please set a time higher than 0 seconds", "red", true);
    return;
  }
  removeAnnotations();
  target.style.animation = "borderFadeInOut 1.5s infinite";
  timerInterval = setInterval(() => {
    timer--;

    timeLeftDisplay.textContent = "Time Left: " + timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      createMsg(msgBox, "Time's up!", "red", false);
      gameOver.style.display = "";
      target.style.animation = "";
      target.textContent = "Find: ";
    }
  }, 1000);
  if (timer > 0) {
    RandomSquare();
  }
}

function RandomSquare() {
  let matrix = whiteIsSelected ? whitePerspective : blackPerspective;

  const randomRowIndex = Math.floor(Math.random() * whitePerspective.length);
  const randomColumnIndex = Math.floor(
    Math.random() * whitePerspective[0].length
  );
  let randomSquare = matrix[randomRowIndex][randomColumnIndex];
  target.textContent = "Find: " + randomSquare;
  currentAnnotation = randomSquare;
}
function handelSquareClick(annotation, timer) {
  if (timer > 0) {
    if (annotation === currentAnnotation) {
      correctGuesses++;
      correctCounter.innerText = "Correct: " + correctGuesses;
      createMsg(msgBox, "Correct!", "red", true);
    } else {
      wrongGuesses++;
      wrongCounter.innerText = "Wrong: " + wrongGuesses;
      createMsg(msgBox, "Wrong!", "blue", true);
    }
    const square = document.getElementById(annotation);
    createMsg(square, annotation, "black", true);
    RandomSquare();
  }
}
function resetCounters() {
  correctGuesses = 0;
  wrongGuesses = 0;
  correctCounter.innerText = "Correct: " + correctGuesses;
  wrongCounter.innerText = "Wrong: " + wrongGuesses;
}
function removeAnnotations() {
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.textContent = "";
  });
}
function createMsg(element, text, color, timeout) {
  element.innerText = text;
  element.style.color = color;
  if (timeout) {
    setTimeout(() => {
      element.innerText = "";
    }, 1000);
  }
}
function updateCursor(perspective) {
  if (perspective === "white") {
    board.classList.add("white-cursor");
    board.classList.remove("black-cursor");
  } else {
    board.classList.add("black-cursor");
    board.classList.remove("white-cursor");
  }
}

function rotateBoard() {
  board.classList.remove("rotate");

  setTimeout(() => {
    board.classList.add("rotate");
  }, 100);
}
