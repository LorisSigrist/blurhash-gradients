import { decode } from "blurhash";
import { decode83 } from "./decode83.js";

/**
 *
 * @typedef {Partial<{
 *    width: number;
 *    height: number;
 *    blur: number;
 * }>} BlurhashGradientOptions
 *
 * @typedef {{
 *      backgroundImage: string;
 *      backgroundSize: string;
 *      backgroundPosition: string;
 *      backgroundRepeat: string;
 *      boxShadow: string;
 *      filter: string;
 *      clipPath: string;
 * }} BlurhashCSS
 */

/** @type {Required<BlurhashGradientOptions>} */
const DEFAULT_OPTIONS = {
  width: 8,
  height: 8,
  blur: 20,
};

/**
 * Approximates the appearance of a blurhash using CSS gradients.
 * The higher the resolution, the larger the resulting CSS will be.
 * The default parameters result in a CSS string of about 650bytes.
 *
 * @param {string} blurhash A blurhash string.
 * @param {BlurhashGradientOptions} options
 * @returns {BlurhashCSS} An object representing the CSS properties needed to display the blurhash.
 */
export function blurhashAsGradients(blurhash, options = {}) {

  const { width, height, blur } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const pixels = decode(blurhash, width, height, 1);

  const backgroundSize = asPercentage(1 / width) + " 100%";
  const backgroundRepeat = "no-repeat";

  /** @type {string[]} */
  const backgroundPositions = [];
  /** @type {string[]} */
  const backgroundImages = [];

  for (let x = 0; x < width; x++) {
    /** @type {string[]} */
    const stops = [];

    for (let y = 0; y < height; y++) {
      const hex = getColor(pixels, x, y, width);
      stops.push(hex);
    }

    backgroundImages.push(`linear-gradient(${stops.join(",")})`);
    const bgPosition = x == 0 ? "0 0" : `${asPercentage(x / (width - 1))} 0`;
    backgroundPositions.push(bgPosition);
  }

  //To avoid blurry edges we use the average color as a backdrop
  const boxShadow = `0 0 0 10000px ${getAverageColor(blurhash)}`;

  return {
    backgroundImage: backgroundImages.join(","),
    backgroundPosition: backgroundPositions.join(","),
    backgroundSize,
    backgroundRepeat,
    boxShadow,
    filter: `blur(${blur}px)`,
    clipPath: "inset(0)",
  };
}

/**
 * Returns the color of a pixel in a Uint8ClampedArray representing an image as a compact hex string.
 * We're not using ImageData because it's not available in Node.
 *
 * @param {Uint8ClampedArray} pixels The pixels of an image.
 * @param {number} x
 * @param {number} y
 * @param {number} width The width of the image in pixels.
 * @returns {string}
 */
function getColor(pixels, x, y, width) {
  const CHANNELS = 4;
  const BYTES_PER_ROW = width * CHANNELS;

  const index = y * BYTES_PER_ROW + x * CHANNELS;
  const r = pixels[index];
  const g = pixels[index + 1];
  const b = pixels[index + 2];

  return rgbToCompactHex(r, g, b);
}

/**
 * Formats a ratio as a percentage string with at most one decimal place.
 * @param {number} ratio
 * @returns {string}
 */
function asPercentage(ratio) {
  const percentage = ratio * 100;
  if (percentage === Math.round(percentage)) return percentage + "%";
  const percentageString = percentage.toFixed(1);
  return percentageString + "%";
}

/**
 * Returns the compact hex representation (#123) of the given rgb color
 *
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {string} #123
 */
function rgbToCompactHex(r, g, b) {
  //Reduce each channel to just 16 values (256 / 16 = 16)
  r = Math.floor(r / 16);
  g = Math.floor(g / 16);
  b = Math.floor(b / 16);

  //Convert to hex
  const rHex = r.toString(16)[0];
  const gHex = g.toString(16)[0];
  const bHex = b.toString(16)[0];

  return "#" + rHex + gHex + bHex;
}

/**
 * Gets the average color of an image's blurhash
 * Blurhash always includes the average color in full precision.
 *
 * @see https://github.com/woltapp/blurhash/blob/master/Algorithm.md
 *
 * @param {string} blurhash
 * @returns {string} #123
 */
function getAverageColor(blurhash) {
  const value = blurhash.substring(2, 6);
  const averageColor = decode83(value); //24bit value where the first 8 bits are red, the next 8 bits are green, and the last 8 bits are blue

  const r = averageColor >> 16;
  const g = (averageColor >> 8) & 0xff;
  const b = averageColor & 0xff;

  return rgbToCompactHex(r, g, b);
}
