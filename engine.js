const { lstatSync, readdirSync, readFile } = require('fs')
const { join } = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const isFile = source => lstatSync(source).isFile()

// const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)
// const getFiles = source => readdirSync(source).map(name => join(source, name)).filter(isFile)

module.exports = recursiveMapFilesAndFolders = (source, mapContent, onError) => {
    const filesOrFolders = readdirSync(source)
    filesOrFolders.map(fileOrFolder => {
        var test = join(source, fileOrFolder)
        if (isDirectory(test)) {
            recursiveMapFilesAndFolders(test, mapContent, onError)
        }else if(isFile(test)) {
            readFile(test, 'utf8', function (err,data) {
                if (err) {
                    onError(err)
                    return;
                }
                mapContent(test, data)
            });
        }
    })
}