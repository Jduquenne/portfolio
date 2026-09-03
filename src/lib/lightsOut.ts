export type Grid = boolean[];

export const LIGHTS_OUT_SIZES = [4, 5, 6] as const;
export const LIGHTS_OUT_DEFAULT_SIZE = 5;

const SCRAMBLE_CLICKS = 8;

function emptyGrid(size: number): Grid {
  return new Array(size * size).fill(false);
}

/** Toggles a cell and its orthogonal neighbours, returning a new grid. */
export function press(size: number, grid: Grid, index: number): Grid {
  const next = grid.slice();
  const row = Math.floor(index / size);
  const col = index % size;
  const flip = (r: number, c: number) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    next[r * size + c] = !next[r * size + c];
  };
  flip(row, col);
  flip(row - 1, col);
  flip(row + 1, col);
  flip(row, col - 1);
  flip(row, col + 1);
  return next;
}

function buildGrid(size: number, clicks: number[]): Grid {
  return clicks.reduce(
    (grid, index) => press(size, grid, index),
    emptyGrid(size),
  );
}

export function isSolved(grid: Grid): boolean {
  return grid.every((cell) => !cell);
}

/** A solvable, non-trivial board obtained by applying random presses. */
export function scramble(size: number): Grid {
  const clicks = Array.from({ length: SCRAMBLE_CLICKS }, () =>
    Math.floor(Math.random() * size * size),
  );
  const grid = buildGrid(size, clicks);
  return isSolved(grid) ? scramble(size) : grid;
}
