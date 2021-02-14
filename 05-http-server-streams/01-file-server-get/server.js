const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname && pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end(`Nested path does not supported`);

    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      fs.access(filepath, fs.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end(`Cannot find file ${pathname}`);
          return;
        }

        const stream = fs.createReadStream(filepath);
        stream.pipe(res);
        stream.on('error', (err) => {
          res.statusCode = 500;
          res.end('Unknown error: ' + err.message);
        });
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
