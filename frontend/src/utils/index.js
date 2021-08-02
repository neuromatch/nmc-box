import color from './color';
import fake from './fake';
import Fa, { initFontAwesome } from './fontawesome';
import IO from './IO';
import logger from './logger';
import misc from './misc';
import typography, { rhythm } from './typography';

const {
  Datetime, Key, getRandomColorFromText, isMobile, confirmPromise,
  selectConverter, serializeSelectedDatetime, deserializeSelectedDatetime,
  encodeBase64, decodeBase64,
} = misc;

const {
  createArrayWithNumbers,
  generateFakeAbstracts,
  generateFakeMatchPartners,
  generateFakePosters,
  generateFakeMatches,
} = fake;

export {
  color,
  // fake
  createArrayWithNumbers,
  generateFakeAbstracts,
  generateFakeMatchPartners,
  generateFakePosters,
  generateFakeMatches,
  // endfake
  Fa,
  initFontAwesome,
  IO,
  logger,
  // misc
  Datetime, Key, getRandomColorFromText, isMobile, confirmPromise,
  selectConverter, serializeSelectedDatetime, deserializeSelectedDatetime,
  encodeBase64, decodeBase64,
  // endmisc
  typography,
  rhythm,
};
