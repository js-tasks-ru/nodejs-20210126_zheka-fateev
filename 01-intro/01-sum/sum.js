const throwWrongTypeError = () => {
  throw new TypeError('Wrong type');
};

const sum = (...args) => args.every((num) => Number.isInteger(num)) ?
    args.reduce((res, item) => res + item) :
    throwWrongTypeError();

module.exports = sum;
