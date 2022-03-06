// CONSTANTS
const DEFAULT_SIZE = 16;
const DEFAULT_BOARD_COLOR = 'white';
const DEFAULT_DRAW_COLOR = 'black';
const DRAW_MODE = 'draw';
const RAINBOW_MODE = 'rainbow';
const ERASE_MODE = 'eraser';

// DOM ELEMENTS
const $sketchBoard = document.querySelector('.sketch-board');
const $settingsButtons = document.querySelectorAll('.btn');
const $btnDraw = document.querySelector('.btn--draw');
const $btnRainbow = document.querySelector('.btn--rainbow');
const $btnErase = document.querySelector('.btn--erase');
const $btnClear = document.querySelector('.btn--clear');

let isDrawing = false;
let currMode = DRAW_MODE;

const etch = (e, color = DEFAULT_DRAW_COLOR) => {
  e.preventDefault();

  if (e.type === 'mouseover' && !isDrawing) return;

  if (currMode === RAINBOW_MODE) color = rainbowMode();
  else if (currMode === ERASE_MODE) color = DEFAULT_BOARD_COLOR;

  e.target.style.backgroundColor = color;
};

const clearBoard = () =>
  [...$sketchBoard.children].forEach(
    child => (child.style.backgroundColor = DEFAULT_BOARD_COLOR)
  );

const removeActiveClass = mode => {
  $settingsButtons.forEach(btn => {
    if (btn.dataset.setting !== mode && btn.classList.contains('active')) {
      btn.classList.remove('active');
    }
  });
};

const changeMode = mode => {
  currMode = mode;

  removeActiveClass(currMode);

  if (currMode === DRAW_MODE) $btnDraw.classList.add('active');
  else if (currMode === RAINBOW_MODE) $btnRainbow.classList.add('active');
  else if (currMode === ERASE_MODE) $btnErase.classList.add('active');
};

const createBoard = size => {
  for (let i = 1; i <= size * size; i++) {
    const boardEl = document.createElement('div');
    boardEl.classList.add('sketch-board__item');

    boardEl.addEventListener('mouseover', etch);
    boardEl.addEventListener('mousedown', etch);

    $sketchBoard.append(boardEl);
  }
};

const rainbowMode = () => {
  const rainbowColors = [
    '#dc2626', //red
    '#f97316', //orange
    '#fbbf24', //yellow
    '#4ade80', //green
    '#3b82f6', //blue
    '#8b5cf6', //violet
    '#4338ca', //indigo
  ];

  const color = Math.floor(Math.random() * rainbowColors.length);

  return rainbowColors[color];
};

$btnDraw.addEventListener('click', changeMode.bind(null, DRAW_MODE));
$btnRainbow.addEventListener('click', changeMode.bind(null, RAINBOW_MODE));
$btnErase.addEventListener('click', changeMode.bind(null, ERASE_MODE));
$btnClear.addEventListener('click', clearBoard);

window.addEventListener('mouseup', () => {
  isDrawing = false;
});

window.addEventListener('mousedown', () => {
  isDrawing = true;
});

window.onload = () => {
  createBoard(DEFAULT_SIZE);
};
