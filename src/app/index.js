let express = require('express')
let app = express()
let bodyParser = require('body-parser')
require('dotenv').config()
let route = require('./api/routes/route')
let cors = require('cors')
let path = require('path')
const PORT = process.env.PORT || 3001


// app.use(express.urlencoded({ extends: true }))
// app.use(express.json())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())


/*//all requets
app.use(cors()) */
app.use(cors({
    origin: 'http://localhost:3002'
}))

app.use(express.static(path.join(__dirname, 'public')));

route(app)

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + " not found!" })
})

app.listen(PORT, (req, res) => {
    console.log(`Listen to port: ${PORT}`)
})