
const fs = require('fs');
const path = require('path');

module.exports.mkDirPromise = (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, (err) => {
            err ? reject(err) : resolve();
        });
    });
}

module.exports.readFilePromise = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

module.exports.writeFilePromise = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf-8', (err) => {
            err ? reject(err) : resolve();
        })
    });
}

module.exports.readFileRelativePromise = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, filePath), 'utf-8', (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}