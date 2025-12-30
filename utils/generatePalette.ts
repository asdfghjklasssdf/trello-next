import chroma from "chroma-js";

const LIST_COLORS = [
  "#EDE9FE",
  "#FEF2F2",
  "#ECFDF5",
  "#FCE7F3",
  "#FEF3C7",
  "#d7c9f3ff",
  "#DCFCE7",
  "#F3E8FF",
  "#FFF7ED",
  "#F1F5F9",
];

let colorIndex = 0;

export function generatePalette() {
  const bg = LIST_COLORS[colorIndex % LIST_COLORS.length];
  colorIndex++;

  const border = chroma(bg).darken(0.6).hex();
  const text = chroma(bg).darken(3).hex();

  return { bg, border, text };
}
