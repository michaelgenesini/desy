const path = require('path')
const http = require('http')
const express = require('express')
const chalk = require('chalk')
const Handlebars  = require('express-handlebars')
const Helpers = require('./helpers')
const recursiveMapFilesAndFolders = require('./engine')

const PROD = process.env.NODE_ENV === 'production'
const PORT = process.env.APP_PORT || 3000
const HOST = process.env.APP_HOST || '0.0.0.0'

const app = express()

const root = path.resolve(__dirname, '.')
const src = path.resolve(root, 'src')

app.set('views', root)
const hbs = Handlebars.create({
    extname: '.hbs',
    helpers: Helpers,
    defaultLayout: path.resolve(src, 'layout.hbs'),
    partialsDir: path.resolve(src, 'pages')
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use('/static', express.static(src))

recursiveMapFilesAndFolders(src, 'pages', data => {

    app.get('/data', (req, res) => res.send(data))

    data.routes.forEach(route => {

        app.get(route.route, function(req, res, next) {
            res.render('./src/pages/'+route.filename, {
                menu: data.pages,
                data: route,
                currentRoute: route.route
            })
        })

        route.subRoutes.forEach(subRoute => {
            app.get(subRoute.route, function(req, res, next) {
                res.render('./src/pages/'+subRoute.parentFilename, {
                    menu: data.pages,
                    data: route,
                    currentRoute: route.route,
                    partial: subRoute.filename
                })
            })
        })
    })

    const server = http.createServer(app)
    server.listen(PORT, HOST, () => {
        const address = server.address()
        console.log(chalk.green(` Listening on: http://${HOST}:${address.port} `))
    })

})