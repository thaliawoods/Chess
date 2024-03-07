const gameBoard = document.querySelector("#gameboard");

const playerDisplay = document.querySelector("#player");

const infoDisplay = document.querySelector("#info-display");

const width = 8;

let playerGo = "black";

playerDisplay.textContent = "black";

// gameboard
const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

// create squares on the Board and add pieces
function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);
    // square.classList.add('beige')
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }

    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }

    if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }
    gameBoard.append(square);
  });
}

createBoard();

// moves
const allSquares = document.querySelectorAll(".square");

// console.log(allSquares)

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute("square-id");
  draggedElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
  // console.log(e.target)
}

function dragDrop(e) {
  e.stopPropagation();
  // console.log(draggedElement)
  // console.log('playerGo', playerGo)
  // console.log('e.target', e.target)
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target);
  const opponentGo = playerGo === "white" ? "black" : "white";
  // console.log('opponentGo', opponentGo)
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    // must check this first
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement);
      e.target.remove();
      changePlayer();
      return;
    }
    // then check this
    if (taken) {
      infoDisplay.textContent = "you cannot go here!";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }
    if (valid) e.target.append(draggedElement);
    changePlayer();
    return;
  }
}

// change of Player
function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds();
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}

// reverse
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute("square-id", width * width - 1 - i)
  );
}

// revert
function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
}

// check for each piece's special move
// very simplified first with each step to understand the logic
function checkIfValid(target) {
  // console.log(target)
  const targetId =
    Number(target.getAttribute("square-id")) ||
    target.parentNode.getAttribute("square-id");
  const startId = Number(startPositionId);
  const piece = draggedElement.id;
  console.log("targetId", targetId);
  console.log("startId", startId);
  console.log("piece", piece);

  switch (piece) {
    // pawn move
    case "pawn":
      // first row of pawns
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        // +2 for first rows
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        startId + width === targetId ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;

    // knight move
    case "knight":
      if (
        startId + width * 2 + 1 === target ||
        startId + width * 2 - 1 === target ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 + 1 === target ||
        startId - width * 2 - 1 === target ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;

      // bishop move
    case "bishop":
      if (
        // forward one direction
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        // forward other direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        // backwards one direction
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        // backwards other direction
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;

    // rook move
    case "rook":
      if (
        // move up
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        // move down
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        // move right
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
        // move left
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;

      // queen
      if (
        // bishop forward one direction
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        // bishop forward other direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        // bishop backwards one direction
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        // bishop backwards other direction
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild)||
            startId + width === targetId ||
            (startId + width * 2 === targetId &&
              !document.querySelector(`[square-id="${startId + width}"]`)
                .firstChild) ||
            (startId + width * 3 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 2}"]`)
                .firstChild) ||
            (startId + width * 4 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 3}"]`)
                .firstChild) ||
            (startId + width * 5 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 3}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 4}"]`)
                .firstChild) ||
            (startId + width * 6 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 3}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 4}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 5}"]`)
                .firstChild) ||
            (startId + width * 7 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 3}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 4}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 5}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId + width * 6}"]`)
                .firstChild) ||
            // rook move down
            startId - width === targetId ||
            (startId - width * 2 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild) ||
            (startId - width * 3 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 2}"]`)
                .firstChild) ||
            (startId - width * 4 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 3}"]`)
                .firstChild) ||
            (startId - width * 5 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 3}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 4}"]`)
                .firstChild) ||
            (startId - width * 6 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 3}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 4}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 5}"]`)
                .firstChild) ||
            (startId - width * 7 === targetId &&
              !document.querySelector(`[square-id="${startId - width}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 2}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 3}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 4}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 5}"]`)
                .firstChild &&
              !document.querySelector(`[square-id="${startId - width * 6}"]`)
                .firstChild) ||
            // rook move right
            startId + 1 === targetId ||
            (startId + 2 === targetId &&
              !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
            (startId + 3 === targetId &&
              !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
            (startId + 4 === targetId &&
              !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
            (startId + 5 === targetId &&
              !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
            (startId + 6 === targetId &&
              !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
            (startId + 7 === targetId &&
              !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
            // rook move left
            startId - 1 === targetId ||
            (startId - 2 === targetId &&
              !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
            (startId - 3 === targetId &&
              !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
            (startId - 4 === targetId &&
              !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
            (startId - 5 === targetId &&
              !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
            (startId - 6 === targetId &&
              !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
            (startId - 7 === targetId &&
              !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
              !document.querySelector(`[square-id="${startId - 6}"]`).firstChild)
      );
    }
}
