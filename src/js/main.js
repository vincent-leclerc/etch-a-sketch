// GLOBAL CONSTANTS
const DEFAULT_BOARD_SIZE = 16;
const DEFAULT_BOARD_COLOR = '#ffffff';
const DEFAULT_DRAW_COLOR = '#000000';
const COLOR_MODE = 'color';
const RAINBOW_MODE = 'rainbow';
const ERASE_MODE = 'eraser';
const DARKEN_MODE = 'darken';
const FILL_MODE = 'fill';
const SHADE_PERCENT = 0.1;

// DOM ELEMENTS
const $sketchBoard = document.querySelector('.sketch-board');
const $settingsButtons = document.querySelectorAll('.btn');
const $btnColor = document.querySelector('.btn--draw');
const $btnRainbow = document.querySelector('.btn--rainbow');
const $btnErase = document.querySelector('.btn--erase');
const $btnClear = document.querySelector('.btn--clear');
const $colorPicker = document.querySelector('.btn--color-picker');
const $gridSlider = document.querySelector('.settings__size-slider');
const $sizeValue = document.querySelector('.settings__size-value');
const $btnDarken = document.querySelector('.btn--darken');
const $btnFill = document.querySelector('.btn--fill');

// GLOBAL VARIABLES
let isDrawing, currMode, currColor, currSize;

// FUNCTIONS
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

const setCurrSize = newSize => (currSize = newSize);

const updateSizeValue = ({ target: { value: size } } = e) => {
  $sizeValue.textContent = `${size} x ${size}`;
};

const setBoardSize = ({ target: { value: size } } = e) => {
  setCurrSize(size);
  resetBoard();
};

const removeActiveClass = mode => {
  $settingsButtons.forEach(btn => {
    if (btn.dataset.setting !== mode && btn.classList.contains('active')) {
      btn.classList.remove('active');
    }
  });
};

const setMode = mode => {
  // TODO: Guard clause if same mode
  currMode = mode;
  removeActiveClass(currMode);

  if (currMode === COLOR_MODE) $btnColor.classList.add('active');
  else if (currMode === RAINBOW_MODE) $btnRainbow.classList.add('active');
  else if (currMode === ERASE_MODE) $btnErase.classList.add('active');
  else if (currMode === DARKEN_MODE) $btnDarken.classList.add('active');
  else if (currMode === FILL_MODE) $btnFill.classList.add('active');
};

// TODO: Reactivate Color mode after picking color
const setColor = e => (currColor = e.target.value);

const randomRGBValue = () => Math.floor(Math.random() * 256);

const randomColor = () =>
  `rgb(${randomRGBValue()}, ${randomRGBValue()}, ${randomRGBValue()})`;

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

const draw = e => {
  e.preventDefault();
  const { type, target } = e;

  if (type === 'mouseover' && !isDrawing) return;

  if (currMode !== DARKEN_MODE) {
    target.removeAttribute('data-shade');
    target.removeAttribute('data-initial-rgb');
  }

  if (currMode === RAINBOW_MODE) {
    target.style.backgroundColor = randomColor();
  } else if (currMode === ERASE_MODE) {
    target.style.backgroundColor = DEFAULT_BOARD_COLOR;
  } else if (currMode === COLOR_MODE) {
    target.style.backgroundColor = currColor;
  } else if (currMode === DARKEN_MODE) {
    darken(target);
  } else if (currMode === FILL_MODE) {
    fillBoard();
  }
};

const init = () => {
  isDrawing = false;
  currMode = COLOR_MODE;
  currColor = DEFAULT_DRAW_COLOR;
  currSize = DEFAULT_BOARD_SIZE;

  setBoard(DEFAULT_BOARD_SIZE);
};
init();

$btnColor.addEventListener('click', setMode.bind(null, COLOR_MODE));
$btnRainbow.addEventListener('click', setMode.bind(null, RAINBOW_MODE));
$btnErase.addEventListener('click', setMode.bind(null, ERASE_MODE));
$btnDarken.addEventListener('click', setMode.bind(null, DARKEN_MODE));
$btnFill.addEventListener('click', setMode.bind(null, FILL_MODE));
$btnClear.addEventListener('click', resetBoard);
$colorPicker.addEventListener('input', setColor);
$gridSlider.addEventListener('input', updateSizeValue);
$gridSlider.addEventListener('change', setBoardSize);
window.addEventListener('mouseup', () => {
  isDrawing = false;
});
window.addEventListener('mousedown', () => {
  isDrawing = true;
});
