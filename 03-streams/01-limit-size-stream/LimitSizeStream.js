const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.currentSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currentSize += Buffer.byteLength(chunk.toString(), 'utf8');
    const error = this.currentSize > this.limit ? new LimitExceededError() : null;
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
