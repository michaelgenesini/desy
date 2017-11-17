const FileHound = require('filehound')

module.exports = recursiveMapFilesAndFolders = (source, mapContent, onError) => {

    let data = {
        routes: [],
        pages: []
    }

    const files = FileHound.create()
        .paths(source)
        .find()

    files.then(filenames => {
        filenames.map(filename => {
            var fn = filename
            var r = fn.replace('src', '').replace(/\/index.hbs/, '/').replace(/[0-9\_]+/g, '')
            data.routes.push({
                route: r.toLowerCase(),
                filename: filename
            })
            data.pages.push({
                link: r.toLowerCase(),
                name: r
            })
        })
        mapContent(data)
    })
}