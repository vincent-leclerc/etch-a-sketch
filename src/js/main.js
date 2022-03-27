'use strict';

// GLOBAL CONSTANTS
const DEFAULT_BOARD_COLOR = '#ffffff';
const DEFAULT_BOARD_SIZE = 16;
const DEFAULT_DRAW_COLOR = '#000000';

const COLOR_MODE = 'color';
const DARKEN_MODE = 'darken';
const ERASE_MODE = 'eraser';
const FILL_MODE = 'fill';
const RAINBOW_MODE = 'rainbow';

const SHADE_PERCENT = 0.1;

// DOM ELEMENTS
const $btnClear = document.querySelector('.btn--clear');
const $btnColor = document.querySelector('.btn--draw');
const $btnDarken = document.querySelector('.btn--darken');
const $btnErase = document.querySelector('.btn--erase');
const $btnFill = document.querySelector('.btn--fill');
const $btnRainbow = document.querySelector('.btn--rainbow');
const $colorPicker = document.querySelector('.btn--color-picker');
const $gridSlider = document.querySelector('.settings__size-slider');
const $settingsButtons = document.querySelectorAll('.btn--settings');
const $sizeValue = document.querySelector('.settings__size-value');
const $sketchBoard = document.querySelector('.sketch-board');

// GLOBAL VARIABLES
let isDrawing, currMode, currColor, currSize;

//////////////////////////////
// BOARD

const setBoard = size => {
  $sketchBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  $sketchBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 1; i <= size * size; i++) {
    const boardEl = document.createElement('div');
    boardEl.classList.add('sketch-board__item');
    boardEl.style.backgroundColor = DEFAULT_BOARD_COLOR;

    boardEl.addEventListener('mouseover', draw);
    boardEl.addEventListener('mousedown', draw);

    $sketchBoard.append(boardEl);
  }
};

const clearBoard = () => ($sketchBoard.innerHTML = '');

const resetBoard = () => {
  clearBoard();
  setBoard(currSize);
};

const updateSizeValue = newSize => {
  $sizeValue.textContent = `${newSize} x ${newSize}`;
};

const setCurrSize = newSize => (currSize = newSize);

const setBoardSize = newSize => {
  setCurrSize(newSize);
  resetBoard();
};

$gridSlider.addEventListener('input', e => updateSizeValue(e.target.value));
$gridSlider.addEventListener('change', e => setBoardSize(e.target.value));
$btnClear.addEventListener('click', resetBoard);

//////////////////////////////
// MODES

const setMode = newMode => {
  if (newMode === currMode) return;

  currMode = newMode;
  setActiveBtn(currMode);
};

const setActiveBtn = mode => {
  // 1) Remove current active class
  $settingsButtons.forEach(
    btn => btn.classList.contains('active') && btn.classList.remove('active')
  );

  // 2) Add new active class
  if (mode === COLOR_MODE) $btnColor.classList.add('active');
  else if (mode === RAINBOW_MODE) $btnRainbow.classList.add('active');
  else if (mode === ERASE_MODE) $btnErase.classList.add('active');
  else if (mode === DARKEN_MODE) $btnDarken.classList.add('active');
  else if (mode === FILL_MODE) $btnFill.classList.add('active');
};

$settingsButtons.forEach(btn =>
  btn.addEventListener('click', () => setMode(btn.dataset.setting))
);

//////////////////////////////
// COLORS

const setColor = newColor => (currColor = newColor);
$colorPicker.addEventListener('input', e => setColor(e.target.value));

const randomRGBValue = () => Math.floor(Math.random() * 256);

const randomColor = el => {
  el.style.backgroundColor = `rgb(${randomRGBValue()}, ${randomRGBValue()}, ${randomRGBValue()})`;
};

const darken = el => {
  if (el.dataset.shade >= 10 || el.style.backgroundColor === 'rgb(0, 0, 0)')
    return;

  // Set initial color (before any shading applied) and shade datasets for reference
  if (!el.dataset.shade) {
    el.dataset.initialRgb = el.style.backgroundColor;
    el.dataset.shade = 1;
  } else {
    el.dataset.shade++;
  }

  /*
    Get initial rgb values into an array =>
    Decrease them based on the amount of shading
  */
  const [newR, newG, newB] = el.dataset.initialRgb
    .replace(/[rgb()]/g, '')
    .split(',')
    .map(val => val - val * SHADE_PERCENT * el.dataset.shade);

  el.style.backgroundColor = `rgb(${newR}, ${newG}, ${newB})`;
};

const fillBoard = () => {
  Array.from($sketchBoard.children).forEach(child => {
    child.removeAttribute('data-shade');
    child.removeAttribute('data-initial-rgb');

    child.style.backgroundColor = currColor;
  });
};

$colorPicker.addEventListener('input', e => setColor(e.target.value));

//////////////////////////////
// DRAW

const draw = e => {
  e.preventDefault();

  const { type, target } = e;

  if (type === 'mouseover' && !isDrawing) return;

  if (currMode !== DARKEN_MODE) {
    target.removeAttribute('data-shade');
    target.removeAttribute('data-initial-rgb');
  }

  if (currMode === RAINBOW_MODE) {
    randomColor(target);
  } else if (currMode === DARKEN_MODE) {
    darken(target);
  } else if (currMode === FILL_MODE) {
    fillBoard();
  } else if (currMode === COLOR_MODE) {
    target.style.backgroundColor = currColor;
  } else if (currMode === ERASE_MODE) {
    target.style.backgroundColor = DEFAULT_BOARD_COLOR;
  }
};

const setIsDrawing = bool => (isDrawing = bool);

window.addEventListener('mouseup', () => setIsDrawing(false));
window.addEventListener('mousedown', () => setIsDrawing(true));

//////////////////////////////

const init = () => {
  isDrawing = false;
  currMode = COLOR_MODE;
  currColor = DEFAULT_DRAW_COLOR;
  currSize = DEFAULT_BOARD_SIZE;

  setBoard(DEFAULT_BOARD_SIZE);
};
init();
