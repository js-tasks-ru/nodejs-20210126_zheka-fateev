const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.remainder = '';
  }

  _transform(chunk, encoding, callback) {
    const value = chunk.toString();
    const splitted = value.split(os.EOL);

    if (this.remainder && splitted.length > 1) {
      this.push(this.remainder + splitted[0]);
      this.remainder = '';
      splitted.shift();
    }

    const last = splitted.pop();
    splitted.forEach((string) => this.push(string));
    this.remainder += last;

    callback();
  }

  _flush(callback) {
    if (this.remainder) {
      this.push(this.remainder);
    }
    callback();
  }
}

module.exports = LineSplitStream;
