const express = require('express') // REQUIRE EXPRESS DEPENDECY
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

// REQUIRE FILES
const api = require('./routes/api')

// SET EXPRESS INSTANCE
const app = express()

// MIDDLEWARES
app.use(express.json())
app.use(morgan('combined'))
app.use('/v1', api)

module.exports = app
