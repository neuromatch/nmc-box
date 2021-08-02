const baseSpace = 0.156;

const generator = (base, max) => {
  const result = {};

  Array.from({ length: max }).forEach((_, ind) => { result[ind] = base * ind; });

  return result;
};

const sizes = {
  ...generator(baseSpace, 15),
  marginBottom: '1.56rem',
};

export default sizes;
