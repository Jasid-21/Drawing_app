function FromRGBtoHSL(rgb: string): string {
  const rgba = rgb.includes('rgba');
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  const rgb_arr = rgb.slice(rgba?5:4, rgb.length - 1).split(sep);
  const components = rgb_arr.map((s) => Number(s) / 255);

  if (rgba) components[3] = Number(rgb_arr[3]);
  else components.push(1);
  const [r, g, b, a] = components;

  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

   // Calculate lightness
   l = (cmax + cmin) / 2;

   // Calculate saturation
   s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

   // Multiply l and s by 100
   s = +(s * 100).toFixed(1);
   l = +(l * 100).toFixed(1);

   return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
}

export default FromRGBtoHSL;
