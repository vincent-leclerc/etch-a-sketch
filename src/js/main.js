// CONSTANTS
const DEFAULT_SIZE = 16;
const DEFAULT_BOARD_COLOR = 'white';
const DEFAULT_DRAW_COLOR = 'black';
const DRAW_MODE = 'draw';
const ERASE_MODE = 'erase';

// DOM ELEMENTS
const $sketchBoard = document.querySelector('.sketch-board');
const $btnClear = document.querySelector('.btn--clear');
const $btnErase = document.querySelector('.btn--erase');
const $btnDraw = document.querySelector('.btn--draw');

let isDrawing = false;
let currMode = DRAW_MODE;

const etch = (e, color = DEFAULT_DRAW_COLOR) => {
  e.preventDefault();

  if (e.type === 'mouseover' && !isDrawing) return;

  currMode === ERASE_MODE && (color = DEFAULT_BOARD_COLOR);
  e.target.style.backgroundColor = color;
};

const clearBoard = () =>
  [...$sketchBoard.children].forEach(
    child => (child.style.backgroundColor = DEFAULT_BOARD_COLOR)
  );

const drawMode = () => {
  currMode = DRAW_MODE;

  $btnErase.classList.remove('active');
  $btnDraw.classList.add('active');
};

const eraseMode = () => {
  currMode = ERASE_MODE;

  $btnDraw.classList.remove('active');
  $btnErase.classList.add('active');
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

$btnClear.addEventListener('click', clearBoard);
$btnErase.addEventListener('click', eraseMode);
$btnDraw.addEventListener('click', drawMode);

window.addEventListener('mouseup', () => {
  isDrawing = false;
});

window.addEventListener('mousedown', () => {
  isDrawing = true;
});

window.onload = () => {
  createBoard(DEFAULT_SIZE);
};
