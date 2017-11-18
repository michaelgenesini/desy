const FileHound = require('filehound')
const path = require('path')
const chalk = require('chalk')

const cleanFilename = (filename, basePath = '') => {

    let fn = filename.replace(basePath, '')

    // Clean Route Name
    let name = fn.replace('src', '')
                .replace(/[0-9\_]+/g, '')
                .replace(/\/index.hbs/, '')
                .replace(/[-]+/g, ' ')
                .replace(/[\/]+/, '')
    name = name === '' ? 'Home': name
    // Clean Route Url
    let route = fn.toLowerCase()
                    .replace('src', '')
                    .replace(/\s/g, '-')
                    .replace(/[0-9\_]+/g, '')
                    .replace(/\/index.hbs/, '/')
    // Get Route Order
    let order = filename.match(/(\d)(?!.*\d)/)
    order = (order && order.length) ? parseInt(order[0]) : 0

    return {
        name: name,
        route: route,
        order: order,
        filename: fn
    }
}

module.exports = recursiveMapFilesAndFolders = (basePath, source, mapRoutes, onError) => {

    console.log('\n')
    console.log(chalk.white.bgMagenta('  DESY  '),chalk.yellow('IS MAPPING FILES AND FOLDERS TO ROUTES 🐛'))

    let data = {
        routes: [],
        pages: []
    }

    const files = FileHound.create()
        .depth(2)
        .path(path.resolve(basePath, source))
        .find()

    files.then(files => {

        files.reverse().map(file => {

            let r = { route, name, order, filename } = cleanFilename(file, path.resolve(basePath, source))

            let test = route.match(/^(\/\w+\/)/)
            
            if(route === '/' || test) {
                let parent = data.routes.filter(r => r.route === test[0])[0]
                // testing subroutes
                if (parent) {
                    parent.subRoutes.push({
                        route: route,
                        name: name,
                        filename: filename,
                        order: order,
                        parentFilename: parent.filename
                    })
                    parent.subRoutes.sort((a, b) => a.order - b.order)
                }else{
                    data.routes.push({
                        route: route,
                        name: name,
                        filename: filename,
                        order: order,
                        subRoutes: []
                    })
                    data.pages.push({
                        link: route,
                        name: name,
                        order: order
                    })
                }
            }else{
                data.routes.push({
                    route: route,
                    name: name,
                    filename: filename,
                    order: order,
                    subRoutes: []
                })
                data.pages.push({
                    link: route,
                    name: name,
                    order: order
                })
            }

        })

        data.routes.sort((a, b) => a.order - b.order)
        data.pages.sort((a, b) => a.order - b.order)

        console.log(chalk.white.bgMagenta('  DESY  '), chalk.green('DONE HER JOB! Serving Pages 🦋 \n'))
        mapRoutes(data)

    })
}