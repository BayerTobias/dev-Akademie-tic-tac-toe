let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle";
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let gameOver = false;

function init() {
  render();
  updatePlayerDisplay();
}

//Render Section

function render() {
  const container = document.getElementById("container");
  const html = generateTableHTML();
  container.innerHTML = html;
}

function generateTableHTML() {
  let html = "<table>";
  for (let i = 0; i < 3; i++) {
    html += generateTableRowHTML(i);
  }
  html += "</table>";
  return html;
}

function generateTableRowHTML(rowNumber) {
  let html = "<tr>";
  for (let j = 0; j < 3; j++) {
    const index = rowNumber * 3 + j;
    html += generateTableCellHTML(index);
  }
  html += "</tr>";
  return html;
}

function generateTableCellHTML(index) {
  return `<td onclick="handleClick(${index})"></td>`;
}

//Handle Click

function handleClick(index) {
  if (gameOver || fields[index] !== null) {
    return;
  }
  fields[index] = currentPlayer;
  const cell = document.getElementsByTagName("td")[index];
  setCellContent(cell);
  togglePlayer();
  updatePlayerDisplay();
  checkGameOver();
}

function setCellContent(cell) {
  if (currentPlayer === "circle") {
    cell.innerHTML = generateAnimatedCircle(70, 70);
  } else {
    cell.innerHTML = generateCross(70, 70);
  }
}

function togglePlayer() {
  currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
}

//Game Over

function checkGameOver() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (isWinningCombo(a, b, c)) {
      const cells = document.getElementsByTagName("td");
      gameOver = true;
      removePlayerDisplay();
      showResultOverlay(fields[a]);
      drawWinningLine([cells[a], cells[b], cells[c]]);
      return;
    }
  }
  if (isDraw()) {
    gameOver = true;
    removePlayerDisplay();
    showResultOverlay("draw");
  }
}

function isWinningCombo(a, b, c) {
  return (
    fields[a] !== null && fields[a] === fields[b] && fields[b] === fields[c]
  );
}

function isDraw() {
  return fields.every((field) => field !== null);
}

//Overlay

function showResultOverlay(result) {
  const overlay = createOverlay();
  const message = createMessage(result);
  const restartButton = createRestartButton();
  overlay.appendChild(message);
  overlay.appendChild(restartButton);

  document.body.appendChild(overlay);
}

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  return overlay;
}

function createMessage(result) {
  const message = document.createElement("div");
  message.classList.add("message");
  if (result === "draw") {
    message.textContent = "Unentschieden!";
  } else {
    const playerSymbol =
      result === "circle"
        ? generateAnimatedCircle(40, 40)
        : generateCross(40, 40);
    message.innerHTML = `Spieler&nbsp${playerSymbol}&nbsphat gewonnen!`;
  }
  return message;
}

function createRestartButton() {
  const restartButton = document.createElement("button");
  restartButton.textContent = "Neustart";
  restartButton.addEventListener("click", () => {
    removeOverlay();
    newGame();
  });

  return restartButton;
}

function newGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = "circle";
  gameOver = false;
  init();
}

function removeOverlay() {
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.remove();
  }
}

//Player Diisplay

function updatePlayerDisplay() {
  const playerDisplay = document.getElementById("player-display");
  playerDisplay.style = "";
  playerDisplay.innerHTML = `Spieler&nbsp${
    currentPlayer === "circle"
      ? generateAnimatedCircle(40, 40)
      : generateCross(40, 40)
  }&nbspist and der Reihe`;
}

function removePlayerDisplay() {
  const playerDisplay = document.getElementById("player-display");
  playerDisplay.style = "display: none;";
}

//Winning Line

function drawWinningLine(cells) {
  const canvas = createCanvas();
  const context = canvas.getContext("2d");
  const { startX, startY, endX, endY } = calculateLineCoordinates(cells);

  drawFrame(0);

  function drawFrame(currentFrame) {
    const progress = currentFrame / 30;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "white";
    context.lineWidth = 5;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(currentX, currentY);
    context.stroke();

    if (currentFrame < 30)
      requestAnimationFrame(() => drawFrame(currentFrame + 1));
  }
}

function createCanvas() {
  const canvas = document.createElement("canvas");
  const container = document.getElementById("container");

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.style.position = "absolute";
  canvas.style.top = `${container.offsetTop}px`;
  canvas.style.left = `${container.offsetLeft}px`;

  container.appendChild(canvas);

  return canvas;
}

function calculateLineCoordinates(cells) {
  const cellSize = cells[0].offsetWidth;
  const startX = cells[0].offsetLeft + cellSize / 2;
  const startY = cells[0].offsetTop + cellSize / 2;
  const endX = cells[2].offsetLeft + cellSize / 2;
  const endY = cells[2].offsetTop + cellSize / 2;

  return { startX, startY, endX, endY };
}

//HTML SVG´s

function generateAnimatedCircle(h, w) {
  const height = h;
  const width = w;
  const circle = `
    <svg width="${width}" height="${height}">
      <circle cx="${width / 2}" cy="${height / 2}" r="${
    height / 2 - 5
  }" fill="none" stroke="rgb(0,176,240)" stroke-width="5" stroke-dasharray="${
    Math.PI * (height - 10)
  }" stroke-dashoffset="${
    Math.PI * (height - 10)
  }" style="animation: drawCircle 225ms ease-in-out forwards;"></circle>
      <style>
        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }
      </style>
    </svg>
  `;

  return circle;
}

function generateCross(h, w) {
  const color = "rgb(255,192,0)";
  const width = w;
  const height = h;

  const svgHtml = `
    <svg width="${width}" height="${height}">
      <line x1="0" y1="0" x2="${width}" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="0; ${width}" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
      <line x1="${width}" y1="0" x2="0" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="${width}; 0" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
    </svg>
  `;

  return svgHtml;
}
