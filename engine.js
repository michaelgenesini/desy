const FileHound = require('filehound')
const chalk = require('chalk')

module.exports = recursiveMapFilesAndFolders = (source, mapRoutes, onError) => {
    
    console.log('\n')
    console.log(chalk.white.bgMagenta('  DESY  '),chalk.yellow('IS MAPPING FILES AND FOLDERS TO ROUTES 🐛'))

    let data = {
        routes: [],
        pages: []
    }

    const files = FileHound.create()
        .paths(source)
        .find()

    files.then(filenames => {
        filenames.reverse().map(filename => {
            var fn = filename
            // Clean Route Name
            var name = fn.replace('src', '')
                        .replace(/[0-9\_]+/g, '')
                        .replace(/\/index.hbs/, '')
                        .replace(/[-]+/g, ' ')
                        // TBD: remove parent route name
                        // .replace(/\/\w+\//, ' ')
                        .replace(/[\/]+/, '')
            name = name === '' ? 'Home': name
            // Clean Route Url
            var route = filename
                    .toLowerCase()
                    .replace('src', '')
                    .replace(/\s/g, '-')
                    .replace(/[0-9\_]+/g, '')
                    .replace(/\/index.hbs/, '/')
            // Get Route Order
            var order = filename.match(/[0-9\_]+/g)
            order = (order && order.length) ? parseInt(order[0].replace(/[_]/, '')) : 0

            data.routes.push({
                route: route,
                name: name,
                filename: filename,
                order: order
            })
            data.pages.push({
                link: route,
                name: name,
                order: order
            })
        })

        data.routes.sort((a, b) => a.order - b.order)
        data.pages.sort((a, b) => a.order - b.order)

        console.log(chalk.white.bgMagenta('  DESY  '), chalk.green('DONE HER JOB! Serving Pages 🦋 \n'))
        mapRoutes(data)
    })
}