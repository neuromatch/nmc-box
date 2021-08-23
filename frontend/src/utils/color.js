import logger from './logger';

/**
 * @typedef ColorObj
 * @property {number} r - a value of red color (int of 0-255)
 * @property {number} g - a value of green color (int of 0-255)
 * @property {number} b - a value of blue color (int of 0-255)
 * @property {number} a - a value of alpha (float of 0-1)
 *
 * parse - a color parser function
 * @param {string} colorString - string of color in the format of hex (3, 4, 6, 8) or rgb/rgba
 * @returns {ColorObj} an object of color values consists of rgba
 */
function parse(colorString) {
  // validate the input pattern
  const valid = colorString.match(/^#?(?<hex>[0-9a-fA-F]{3,8})$|^rgba?\((?<r>[0-9]{1,3}),\s?(?<g>[0-9]{1,3})\s?,(?<b>[0-9]{1,3})\s?(,(?<a>0|1|0\.[0-9]{0,4}|1\.0{0,4}))?\)$/);

  // doesn't match anything
  if (!valid) {
    logger.warn(parse.name, `colorString does not match the support pattern (${colorString})`);
    return null;
  }

  let rgba;

  if (valid) {
    const {
      hex, r, g, b, a,
    } = valid.groups;

    if (!hex) {
      rgba = {
        ...rgba,
        r: parseInt(r, 10),
        g: parseInt(g, 10),
        b: parseInt(b, 10),
        a: parseFloat(a),
      };
    }

    if (!a) {
      rgba = { ...rgba, a: 1 };
    }

    if (hex) {
      let parsedHex;
      // convert 3 or 4 to 6 or 8
      if (hex.length === 3 || hex.length === 4) {
        parsedHex = hex.split('').map((x) => x.repeat(2)).join('');
      }

      if (hex.length === 6 || hex.length === 8) {
        parsedHex = hex;
      }

      if (!parsedHex) {
        logger.warn(parse.name, `colorString does not match the support pattern (${colorString})`);
        return null;
      }

      if (parsedHex.length === 6) {
        parsedHex = `${parsedHex}FF`;
      }

      rgba = {
        ...rgba,
        r: parseInt(parsedHex.slice(0, 2), 16),
        g: parseInt(parsedHex.slice(2, 4), 16),
        b: parseInt(parsedHex.slice(4, 6), 16),
        a: Math.round((parseInt(parsedHex.slice(6, 8), 16) / 255) * 100) / 100,
      };
    }
  }

  return rgba;
}

/**
 * format - a color formatter function
 * @param {string|object} color - a color value, can be either string in
 * the format of hex or rgb(a?) or color object ({r,g,b,a})
 * @param {function} formatter - a function that returns literal formatted string
 * @example
 *
 *    // rgba(255,255,255,1)
 *    color.format('#ffffff')
 *
 *    // rgb(255,255,255)
 *    color.format(
 *      '#ffffff',
 *      (colorObj) => `rgb(${colorObj.r},${colorObj.g},${colorObj.b})`,
 *    );
 *
 *    // rgb(255,255,255,1)
 *    color.format({r: 255, g: 255, b: 255, a: 1});
 *
 * @returns {string|null} formatted color string
 */
function format(color, formatter) {
  let parsed;

  if (typeof color === 'string') {
    parsed = parse(color);
  }

  if (
    typeof color === 'object'
    && ['r', 'g', 'b', 'a'].every(((prop) => Object.prototype.hasOwnProperty.call(color, prop)))
  ) {
    if (['r', 'g', 'b'].every((prop) => Number.isInteger(color[prop]))
    && typeof color.a === 'number') {
      parsed = color;
    }
  }

  if (!parsed) {
    logger.warn(format.name, `incorrect color input format (${JSON.stringify(color)})`);
    return null;
  }

  if (formatter) {
    return formatter(parsed);
  }

  return `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})`;
}

// an only formatter available now
function hexFormatter(parsed) {
  // https://www.w3schools.com/lib/w3color.js
  function toHex(n) {
    let hex = n.toString(16);
    while (hex.length < 2) {hex = "0" + hex; }
    return hex;
  }

  const r = toHex(parsed.r);
  const g = toHex(parsed.g);
  const b = toHex(parsed.b);

  return `#${r}${g}${b}`;
};

/**
 * contrast - a function to find contrast color, especially useful for finding
 * proper text color against specified background color
 * @param {string} colorString - a string of color in the format of hex or rgb(a?)
 * @returns {('rgba(0,0,0,1)'|'rgba(255,255,255,1)'|null)} black or white (in rgba format)
 * depending on the algorithm
 * @see https://24ways.org/2010/calculating-color-contrast/
 */
function contrast(colorString) {
  const parsed = parse(colorString);

  if (!parsed) {
    logger.warn(contrast.name, `incorrect color input format ${colorString}`);
    return null;
  }

  const { r, g, b } = parsed;
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  return yiq >= 128 ? format('#000') : format('#fff');
}

/**
 * scale - a function to scale color from the specified color in percent
 * @param {string} colorString - a string of color in the format of hex or rgb(a?)
 * @param {number} [scalePercent=100] - a number of percent to be scaled
 * (negative:darker, positive:brighter)
 * @returns {string} a string of scaled color (in rgba format)
 */
function scale(colorString, scalePercent = 100) {
  const parsed = parse(colorString);

  if (!parsed) {
    logger.warn(scale.name, `incorrect color input format (${colorString})`);
    return null;
  }

  const scaler = (origin) => {
    const scaled = Number(origin) + ((scalePercent * 255) / 100);

    if (scaled > 255) {
      return 255;
    }

    if (scaled < 0) {
      return 0;
    }

    return Math.round(scaled);
  };

  return format({
    ...parsed,
    r: scaler(parsed.r),
    g: scaler(parsed.g),
    b: scaler(parsed.b),
  });
}

/**
 * transparentize - a function to adjust alpha of a specified color
 * @param {string} colorString - a string of color in the format of hex or rgb(a?)
 * @param {number} [alpha=1] - alpha to be adjusted (float with range 0 to 1)
 */
function transparentize(colorString, alpha = 1) {
  const parsed = parse(colorString);

  if (!parsed) {
    logger.warn(transparentize.name, `incorrect color input format (${colorString})`);
    return null;
  }

  if (alpha < 0 || alpha > 1) {
    console.warn('[color.transparentize] alpha must be in range of 0 to 1');
    return null;
  }

  return format({
    ...parsed,
    a: alpha,
  });
}

export default {
  parse,
  format,
  contrast,
  scale,
  transparentize,
  hexFormatter,
};
