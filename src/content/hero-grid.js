// Hero backdrop composition.
//
// The grid itself is drawn in CSS. Everything here is placed ON that grid,
// in whole cells, so nothing can land half a cell out of alignment.
//
//   col  cells left (negative) or right (positive) of the page centre line
//   row  cells down from the top of the hero
//   w/h  size in cells
//
// Cell size is --hero-cell (124px) and the grid is centred, so the 1240px
// frame is exactly 10 cells wide and its two rules fall on grid lines.

// Cells filled with the site's diagonal hatch - the same stripe as the
// section dividers, so the hero is made of the page's own materials.
export const HATCH = [
  { col: -7, row: 2, w: 1, h: 3 },
  { col: -6, row: 5, w: 1, h: 4 },
  { col: -5, row: 8, w: 2, h: 1 },
  { col: 5, row: 0, w: 2, h: 2 },
  { col: 6, row: 6, w: 1, h: 3 },
];

// 3x3 clusters of small squares.
export const DOTS = [
  { col: -5, row: 1 },
  { col: -4, row: 4 },
  { col: -6, row: 7 },
  { col: 3, row: 2 },
  { col: 4, row: 5 },
  { col: 5, row: 7 },
];

// Single squares dropped in individual cells.
export const MARKS = [
  { col: -7, row: 0 }, { col: -3, row: 1 }, { col: -6, row: 3 },
  { col: -2, row: 6 }, { col: -4, row: 8 }, { col: 2, row: 0 },
  { col: 4, row: 1 }, { col: 6, row: 3 }, { col: 3, row: 6 },
  { col: 5, row: 8 }, { col: -1, row: 4 }, { col: 1, row: 7 },
];

// Intersections that get a + tick. Kept to the outer columns, the way a
// plan drawing marks its margins rather than every crossing.
export const CROSSES = [];
for (const col of [-7, -6, -5, -4, 4, 5, 6, 7]) {
  for (let row = 0; row <= 9; row++) CROSSES.push({ col, row });
}

// CLI variant of the backdrop. Same materials (grid, hatch, squares, ticks)
// but a different arrangement so the CLI hero reads as a sibling of the home
// hero, not a copy: the hatch is heavier and stacked into two vertical runs
// like column rules on a schematic, and the marks are sparser.
export const HATCH_CLI = [
  { col: -7, row: 0, w: 1, h: 4 },
  { col: -7, row: 6, w: 1, h: 3 },
  { col: -6, row: 3, w: 1, h: 2 },
  { col: 5, row: 1, w: 1, h: 3 },
  { col: 6, row: 4, w: 1, h: 4 },
  { col: 4, row: 8, w: 2, h: 1 },
];

export const DOTS_CLI = [
  { col: -5, row: 2 },
  { col: -4, row: 6 },
  { col: 3, row: 1 },
  { col: 4, row: 5 },
];

export const MARKS_CLI = [
  { col: -6, row: 1 }, { col: -3, row: 4 }, { col: -5, row: 7 },
  { col: 2, row: 3 }, { col: 5, row: 6 }, { col: 3, row: 8 },
  { col: -2, row: 0 }, { col: 1, row: 5 },
];

// Ticks on the two innermost outer columns only, so the CLI margins read
// lighter than the home hero's fuller frame of crosses.
export const CROSSES_CLI = [];
for (const col of [-6, -5, 5, 6]) {
  for (let row = 0; row <= 9; row++) CROSSES_CLI.push({ col, row });
}
