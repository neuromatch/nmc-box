import faker from 'faker';

const createArrayWithNumbers = (length) => (
  Array.from({ length }, (_, k) => k + 1)
);

const talkFormatOptions = [
  'Short talk',
  'Contributed talk',
  'Poster presentation',
  'No preference',
];

function generateFakeAbstracts(numOfAbs) {
  return createArrayWithNumbers(numOfAbs).map((_, ind) => ({
    submission_index: ind + 1,
    id: faker.random.uuid(),
    fullname: faker.name.findName(),
    institution: faker.company.companyName(),
    email: faker.internet.email(),
    title: faker.lorem.sentence(),
    abstract: createArrayWithNumbers(5).map((x) => faker.lorem.paragraph()).join(' '),
    coauthors: createArrayWithNumbers(faker.random.number({ max: 5 }))
      .map(() => faker.name.findName()),
    talk_format: talkFormatOptions[faker.random.number({ max: 2 })],
  }));
}

function generateFakeMatchPartners(numOfPartner) {
  return createArrayWithNumbers(numOfPartner).map(() => ({
    email: faker.internet.email(),
    fullname: faker.name.findName(),
  }));
}

function generateFakePosters(numOfPoster) {
  return createArrayWithNumbers(numOfPoster).map((_, ind) => ({
    title: faker.lorem.sentence(),
    fullname: faker.name.findName(),
    institution: faker.company.companyName(),
    abstract: createArrayWithNumbers(10).map((x) => faker.lorem.sentences()).join(' '),
    id: String(ind).repeat(20),
  }));
}

function generateFakeMatches(numOfMatches) {
  return {
    mind_match: createArrayWithNumbers(numOfMatches).map((_, ind) => ({
      email: faker.internet.email(),
      fullname: faker.name.findName(),
    })),
    group_match: createArrayWithNumbers(numOfMatches).map((_, ind) => ({
      email: faker.internet.email(),
      fullname: faker.name.findName(),
    })),
  };
}

export default {
  createArrayWithNumbers,
  generateFakeAbstracts,
  generateFakeMatchPartners,
  generateFakePosters,
  generateFakeMatches,
};
