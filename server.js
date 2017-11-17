const path = require('path')
const http = require('http')
const express = require('express')
const hbs  = require('express-handlebars')
const recursiveMapFilesAndFolders = require('./engine')

const PROD = process.env.NODE_ENV === 'production'
const PORT = process.env.APP_PORT || 3000
const HOST = process.env.APP_HOST || '0.0.0.0'
const app = express()

app.set('views', path.resolve(__dirname))
app.engine('hbs', hbs({
    defaultLayout: path.resolve(__dirname, 'layout.hbs'),
    partialsDir: __dirname + '/src'
}))
app.set('view engine', 'hbs')
app.use('/static', express.static('dist'))

app.get('/data', (req, res) => res.send(data))

recursiveMapFilesAndFolders('./src/', data => {

    data.routes.forEach(route => {
        app.get(route.route, function(req, res, next) {
            res.render(route.filename, {
                menu: data.pages,
                data: data.routes
            })
        })
    })

})

const server = http.createServer(app)
server.listen(PORT, HOST, () => {
    const address = server.address()
    console.log('Listening on:', address.port)
})