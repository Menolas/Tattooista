const fs = require('fs')
const mv = require('mv')

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