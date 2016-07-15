var http = require('http');
var path = require('path');
var fs = require('fs');

var hostname = 'localhost';
var port = 3000;

function createFileUrl(req) {
    if (req.url == '/') {
        return '/index.html'
    } else {
        return req.url;
    }
 }

function resourceNotFound(res, fileUrl) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<html><body><h1>Error 404: ' + fileUrl +
        ' not found</h1></body></html>');
}

function findResource(request, fileExt, filePath, fileUrl) {
    if (fileExt == '.html') {
        fs.exists(filePath, function (exists) {
            if (!exists) {
                resourceNotFound(request, fileUrl);
                return;
            }

            request.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(filePath).pipe(request);
        })
    } else {
        request.writeHead(404, {'Content-Type': 'text/html'});
        request.end('<html><body><h1>Error 404: ' + fileUrl +
            ' not a HTML file</h1></body></html>');
    }
}

function handleRequest(request, response) {
    if (request.method == 'GET') {
        var fileUrl = createFileUrl(request);
        var filePath = path.resolve('./public' + fileUrl);
        var fileExt = path.extname(filePath);

        findResource(response, fileExt, filePath, fileUrl);
    } else {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end('<html><body><h1>Error 404: ' + request.method +
            ' not supported</h1></body></html>');
    }
}

var server = http.createServer(function (req, res) {
    console.log("Request for" + req.url + " by method " + req.method);
    handleRequest(req, res);
});

server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
