function FromHSLtoCoord(hsl: string, width: number, height: number): number[] {
  const hsla = hsl.includes('hsla');
  const hsl_arr = hsl.slice(hsla?5:6, hsl.length - 1).split(',').map((c) => {
    return c.includes('%') ? c.slice(0, c.length - 1) : c;
  })

  const components = hsl_arr.map((c) => Number(c));
  const [h, s, l, a] = components;

  const hue = (h * width) / 360;
  const x = (s * width) / 100;
  const y = (100 - l) * height / 100;
  const op = (a || 1) * width;

  return [hue, x, y, op];
}

export default FromHSLtoCoord;
