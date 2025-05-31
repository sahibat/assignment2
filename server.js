const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const fileManager = require('./events');

const folderPath = path.join(__dirname, 'files');

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const filename = query.filename;
    const filepath = path.join(folderPath, filename || '');

    if (parsedUrl.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome to the File Management Server!\nUse /create, /read, or /delete with appropriate methods.');
    } else if (parsedUrl.pathname === '/create' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            fs.writeFile(filepath, body, err => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error creating file');
                } else {
                    fileManager.emit('fileCreated', filename);
                    res.writeHead(200);
                    res.end('File created');
                }
            });
        });
    } else if (parsedUrl.pathname === '/read' && req.method === 'GET') {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                fileManager.emit('fileRead', filename);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    } else if (parsedUrl.pathname === '/delete' && req.method === 'DELETE') {
        fs.unlink(filepath, err => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                fileManager.emit('fileDeleted', filename);
                res.writeHead(200);
                res.end('File deleted');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Route not found');
    }
});

server.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});
