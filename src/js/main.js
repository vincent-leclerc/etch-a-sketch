// CONSTANTS
const DEFAULT_SIZE = 16;
const DEFAULT_BOARD_COLOR = '#ffffff';
const DEFAULT_DRAW_COLOR = '#000000';
const COLOR_MODE = 'color';
const RAINBOW_MODE = 'rainbow';
const ERASE_MODE = 'eraser';

// DOM ELEMENTS
const $sketchBoard = document.querySelector('.sketch-board');
const $settingsButtons = document.querySelectorAll('.btn');
const $btnColor = document.querySelector('.btn--draw');
const $btnRainbow = document.querySelector('.btn--rainbow');
const $btnErase = document.querySelector('.btn--erase');
const $btnClear = document.querySelector('.btn--clear');
const $colorPicker = document.querySelector('.btn--color-picker');

let isDrawing = false;
let currMode = COLOR_MODE;
let currColor = DEFAULT_DRAW_COLOR;

const createBoard = size => {
  for (let i = 1; i <= size * size; i++) {
    const boardEl = document.createElement('div');
    boardEl.classList.add('sketch-board__item');

    boardEl.addEventListener('mouseover', etch);
    boardEl.addEventListener('mousedown', etch);

    $sketchBoard.append(boardEl);
  }
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

const setMode = mode => {
  currMode = mode;

  removeActiveClass(currMode);

  if (currMode === COLOR_MODE) $btnColor.classList.add('active');
  else if (currMode === RAINBOW_MODE) $btnRainbow.classList.add('active');
  else if (currMode === ERASE_MODE) $btnErase.classList.add('active');
};

const setColor = e => (currColor = e.target.value);

const rainbowColor = () => {
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

const etch = e => {
  e.preventDefault();
  const { type, target } = e;

  if (type === 'mouseover' && !isDrawing) return;

  if (currMode === RAINBOW_MODE) {
    target.style.backgroundColor = rainbowColor();
  } else if (currMode === ERASE_MODE) {
    target.style.backgroundColor = DEFAULT_BOARD_COLOR;
  } else if (currMode === COLOR_MODE) {
    target.style.backgroundColor = currColor;
  }
};

$btnColor.addEventListener('click', setMode.bind(null, COLOR_MODE));
$btnRainbow.addEventListener('click', setMode.bind(null, RAINBOW_MODE));
$btnErase.addEventListener('click', setMode.bind(null, ERASE_MODE));
$btnClear.addEventListener('click', clearBoard);
$colorPicker.addEventListener('input', setColor);

window.addEventListener('mouseup', () => {
  isDrawing = false;
});

window.addEventListener('mousedown', () => {
  isDrawing = true;
});

window.onload = () => {
  createBoard(DEFAULT_SIZE);
};
