const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

module.exports = function move(oldPath, newPath) {

    fs.rename(oldPath, newPath, err => {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                console.log(err);
            }
            return;
        }
    })

    function copy() {
        let readStream = fs.createReadStream(oldPath);
        let writeStream = fs.createWriteStream(newPath);

        readStream.on('error');
        writeStream.on('error');

        readStream.on('close', function () {
            fs.unlink(oldPath, err => {
                if (err) console.log(err);
            })
        })
        readStream.pipe(writeStream);
    }
}

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

module.exports = function generateFileRandomName (originalName) {
    const fileExt = path.extname(originalName);
    return `${generateRandomString(12)}${fileExt}`;
}

module.exports = function generateFileRandomNameWithDate (originalName) {
    const fileExt = path.extname(originalName);
    return `${Date.now()}_${generateRandomString(12)}${fileExt}`;
}
