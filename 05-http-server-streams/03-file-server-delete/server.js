const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

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
    case 'DELETE':
      fs.unlink(filepath, (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
          } else {
            res.statusCode = 500;
          }

          res.end();

          return;
        }

        res.statusCode = 200;
        res.end();
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
