const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('../../03-streams/01-limit-size-stream/LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname && pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end(`Nested path does not supported`);

    return;
  }

  switch (req.method) {
    case 'POST':
      const stream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 1e6});

      req.pipe(limitStream).pipe(stream);

      stream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end();
        }

        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        }
      }).on('finish', () => {
        res.statusCode = 201;
        res.end('file has been saved');
      });

      req.on('error', () => {
        fs.unlink(filepath, (error) => {
          stream.end();
          res.end();
        });
      });

      req.on('aborted', () => {
        stream.destroy();
        limitStream.destroy();
      });

      limitStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          fs.unlink(filepath, () => {});
          stream.end();
          res.statusCode = 413;
          res.end('File is too big');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
