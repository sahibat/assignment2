const EventEmitter = require('events');
const util = require('util');

function FileManager() {
    EventEmitter.call(this);
}
util.inherits(FileManager, EventEmitter);

const fileManager = new FileManager();

fileManager.on('fileCreated', (filename) => {
    console.log(`File created: ${filename}`);
});

fileManager.on('fileRead', (filename) => {
    console.log(`File read: ${filename}`);
});

fileManager.on('fileDeleted', (filename) => {
    console.log(`File deleted: ${filename}`);
});

module.exports = fileManager;
