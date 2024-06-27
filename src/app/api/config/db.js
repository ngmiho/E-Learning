'use strict'
let mysql = require('mysql')

var db_config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}
var connection

function handleDisconnect() {
    connection = mysql.createConnection(db_config)

    connection.connect(function(err) {
        if (err) {
            console.log(`Database connection error: ${err}`)
            setTimeout(handleDisconnect(), 2000)
        }
    })

    connection.on("err", (req, res) => {
        console.log(err)
        if (err.code == 'PROTOCOL_CONNECTION_LOST') 
            handleDisconnect()
        else 
            throw err
    })
}

handleDisconnect()
module.exports = connection