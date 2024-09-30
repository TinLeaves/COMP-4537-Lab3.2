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

class Server {
    constructor(port) {
        this.port = port;
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const queryObject = parsedUrl.query;

        if (req.method === 'GET' && parsedUrl.pathname.includes('getDate')) {
            this.handleGetDate(queryObject.name, res);
        } else if (req.method === 'GET' && parsedUrl.pathname.includes('writeFile')) {
            this.handleWriteFile(queryObject.text, res);
        } else if (req.method === 'GET' && parsedUrl.pathname.includes('readFile')) {
            const fileName = parsedUrl.pathname.split('/').pop();
            this.handleReadFile(fileName, res);
        } else {
            this.handleNotFound(res);
        }
    }

    handleGetDate(name, res) {
        const currentDate = utils.getDate().toString();
        const greetingMsg = `<p style="color: blue;">${message.hello.replace('%1', name)} ${currentDate}</p>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(greetingMsg);
    }

    handleWriteFile(text, res) {
        const filePath = './readFile/file.txt';
        if (text) {
            fs.appendFile(filePath, text + '\n', (err) => {
                if (err) {
                    this.sendError(res, 500, message.writeError);
                } else {
                    this.sendResponse(res, 200, `${message.appended} ${text}`);
                }
            });
        } else {
            this.sendError(res, 404, message.writeError);
        }
    }

    handleReadFile(fileName, res) {
        const filePath = `./readFile/${fileName}`;
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                this.sendError(res, 404, `${message.notFound} : ${fileName}`);
            } else {
                fs.readFile(filePath, 'utf-8', (err, data) => {
                    if (err) {
                        this.sendError(res, 500, message.readError);
                    } else {
                        this.sendResponse(res, 200, data);
                    }
                });
            }
        });
    }

    handleNotFound(res) {
        this.sendError(res, 404, message.notFound);
    }

    sendResponse(res, statusCode, message) {
        res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        res.end(message);
    }

    sendError(res, statusCode, message) {
        res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        res.end(message);
    }
}

const PORT = 8000;
const server = new Server(PORT);
server.start();

