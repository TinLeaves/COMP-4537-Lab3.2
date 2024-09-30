/**
 * Acknowledgement:
 * This code was developed with the assistance of ChatGPT.
 * ChatGPT was used to provide guidance on code structure.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const message = require('./lang/en/en.js');
const utils = require('./modules/utils.js');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const queryObject = parsedUrl.query;

    if (req.method === 'GET' && parsedUrl.pathname.includes('getDate')) {
        const name = queryObject.name;
        const currentDate = utils.getDate().toString();
        const greetingMsg = `<p style="color: blue;">${message.hello.replace('%1', name)} ${currentDate}</p>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(greetingMsg);
    } else if (req.method === 'GET' && parsedUrl.pathname.includes('writeFile')) {
        const text = queryObject.text;
        handleWriteFile(text, res);
    } else if (req.method === 'GET' && parsedUrl.pathname.includes('readFile')) {
        const fileName = parsedUrl.pathname.split('/').pop();
        handleReadFile(fileName, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`${message.notFound}`);
    }
});

const handleWriteFile = (text, res) => {
    const filePath = './readFile/file.txt';
    if (text) {
        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`${message.writeError}`);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`${message.appended} ${text}`);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`${message.writeError}`);
    }
};

const handleReadFile = (fileName, res) => {
    const filePath = `./readFile/${fileName}`;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`${message.notFound} : ${fileName}`);
        } else {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`${message.readError}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                }
            });
        }
    });
};

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
