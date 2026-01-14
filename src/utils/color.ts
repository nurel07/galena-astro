/**
 * Parses a Hex color string into RGB values [0..1]
 */
function hexToRgb(hex: string): [number, number, number] {
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r / 255, g / 255, b / 255];
}

/**
 * Converts sRGB (0..1) to Linear RGB
 */
function srgbToLinear(c: number): number {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Converts Linear RGB to Oklab
 */
function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    return [
        0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
    ];
}

/**
 * Converts Oklab to Oklch
 */
function oklabToOklch([L, a, b]: [number, number, number]): [number, number, number] {
    const C = Math.sqrt(a * a + b * b);
    let h = (Math.atan2(b, a) * 180) / Math.PI;
    if (h < 0) h += 360;
    return [L, C, h];
}

/**
 * Main helper to convert Hex directly to OKLCH [L, C, h]
 */
export function hexToOklch(hex: string): [number, number, number] {
    const [r, g, b] = hexToRgb(hex);
    const lr = srgbToLinear(r);
    const lg = srgbToLinear(g);
    const lb = srgbToLinear(b);
    return oklabToOklch(linearRgbToOklab(lr, lg, lb));
}
