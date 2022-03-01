const DEFAULT_SIZE = 16;
const DEFAULT_COLOR = 'black';

const $sketchBoard = document.querySelector('.sketch-board');

let isDrawing = false;

const draw = e => {
  e.preventDefault();

  if (e.type === 'mouseover' && !isDrawing) return;
  e.target.style.backgroundColor = DEFAULT_COLOR;
};

const createBoard = size => {
  for (let i = 1; i <= size * size; i++) {
    const boardEL = document.createElement('div');
    boardEL.classList.add('sketch-board__item');

    boardEL.addEventListener('mouseover', draw);
    boardEL.addEventListener('mousedown', draw);

    $sketchBoard.append(boardEL);
  }
};

window.addEventListener('mouseup', () => {
  isDrawing = false;
});

window.addEventListener('mousedown', () => {
  isDrawing = true;
});

window.onload = () => {
  createBoard(DEFAULT_SIZE);
};
