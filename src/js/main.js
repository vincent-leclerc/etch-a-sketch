const DEFAULT_SIZE = 16;
const DEFAULT_BOARD_COLOR = 'white';
const DEFAULT_DRAW_COLOR = 'black';

const $sketchBoard = document.querySelector('.sketch-board');
const $btnClear = document.querySelector('.btn--clear');

let isDrawing = false;

const draw = e => {
  e.preventDefault();

  if (e.type === 'mouseover' && !isDrawing) return;
  e.target.style.backgroundColor = DEFAULT_DRAW_COLOR;
};

const clearBoard = () =>
  [...$sketchBoard.children].forEach(
    child => (child.style.backgroundColor = DEFAULT_BOARD_COLOR)
  );

const createBoard = size => {
  for (let i = 1; i <= size * size; i++) {
    const boardEL = document.createElement('div');
    boardEL.classList.add('sketch-board__item');

    boardEL.addEventListener('mouseover', draw);
    boardEL.addEventListener('mousedown', draw);

    $sketchBoard.append(boardEL);
  }
};

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
