const http = require('http'),
  url = require('url'),
  fs = require('fs');

http.createServer((request, response) => {
  let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Added to log');
      }
    });

    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();
    })

}).listen(8080);

console.log('My first Node test server is running on Port 8080.');

// For incoming requests, parse the request.url to
// determine if the URL contains the word “documentation”
// (request is one of the objects passed to createServer's
// callback function; it contains the request data,
// such as the requested URL). If it does, return
// the “documentation.html” file to the user; otherwise
// return the “index.html” file. For a real-time glance
// at what this should look like, refer to this video
// walkthrough of starting up the server and navigating
// to different pages.
