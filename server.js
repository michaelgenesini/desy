const path = require('path')
const http = require('http')
const express = require('express')
const hbs  = require('express-handlebars')
const recursiveMapFilesAndFolders = require('./engine')

const PROD = process.env.NODE_ENV === 'production'
const PORT = process.env.APP_PORT || 3000
const HOST = process.env.APP_HOST || '0.0.0.0'
const app = express()
let data = {}
let pages = []
recursiveMapFilesAndFolders('./src/', (filename, content) => {
    var route = filename.replace('src', '').replace('index.hbs', '')
    data[route.toLowerCase()] = {
        filename: filename,
        content: content
    }
    pages.push({
        link: route.toLowerCase(),
        name: route
    })
})
app.set('views', path.resolve(__dirname))
app.engine('hbs', hbs({
    defaultLayout: path.resolve(__dirname, 'layout.hbs'),
    partialsDir: __dirname + '/src'
}))
app.set('view engine', 'hbs')
app.use('/static', express.static('dist'))

app.get("/:route?", function(req, res, next) {
    var route = req.params.route ? data[`/${req.params.route}/`] : data['/'];
    res.render(route.filename, {
        menu: pages,
        data: data
    })
})
const server = http.createServer(app)
server.listen(PORT, HOST, () => {
    const address = server.address()
    console.log('Listening on:', address.port)
})