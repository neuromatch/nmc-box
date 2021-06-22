import * as utils from '..';

test('get short-id', () => {
  expect(utils.Key.getShortKey()).toMatch(/[a-zA-Z0-9_]{8}/);
});

test('get random color from text', () => {
  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript#comment39476298_1349404
  const randStr = Math.random().toString(36).replace(/[^a-z]+/g, '');

  expect(utils.getRandomColorFromText(randStr)).toMatch(/#[0-9a-f]{6}/);
});
