// http://www.jacklmoore.com/notes/rounding-in-javascript/
export const round = (num, decimals = 2) =>
  Number(Math.round(num + "e" + decimals) + "e-" + decimals);
export const floor = (num, decimals = 2) =>
  Number(Math.floor(num + "e" + decimals) + "e-" + decimals);
export const ceil = (num, decimals = 2) =>
  Number(Math.ceil(num + "e" + decimals) + "e-" + decimals);
