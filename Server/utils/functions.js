const fs = require('fs')
const mv = require('mv')
const crypto = require('crypto')
const path = require('path')

module.exports = function move(oldPath, newPath) {

    fs.rename(oldPath, newPath, err => {
        if (err) {
            if (err.code === 'EXDEV') {
                copy()
            } else {
                console.log(err)
            }
            return
        }
    })

    function copy() {
        let readStream = fs.createReadStream(oldPath)
        let writeStream = fs.createWriteStream(newPath)

        readStream.on('error')
        writeStream.on('error')

        readStream.on('close', function () {
            fs.unlink(oldPath, err => {
                if (err) console.log(err)
            })
        })
        readStream.pipe(writeStream)
    }
}

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
}

module.exports = function generateFileRandomName (originalName) {
    const fileExt = path.extname(originalName)
    return `${generateRandomString(12)}${fileExt}`
}

module.exports = function generateFileRandomNameWithDate (originalName) {
    const fileExt = path.extname(originalName)
    return `${Date.now()}_${generateRandomString(12)}${fileExt}`
}



// function validateCyrillicFileName(fileName) {
//     const cyrillicPattern = /[\u0400-\u04FF]/; // Cyrillic characters range
//
//     if (cyrillicPattern.test(fileName)) {
//         return true; // Cyrillic characters are present
//     } else {
//         return false; // No Cyrillic characters
//     }
// }

// Usage
// const fileName = 'файл.txt'; // Replace with the actual file name
// const isCyrillic = validateCyrillicFileName(fileName);
//
// if (isCyrillic) {
//     console.log('The file name contains Cyrillic characters.');
// } else {
//     console.log('The file name does not contain Cyrillic characters.');
// }
