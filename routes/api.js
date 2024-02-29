const express = require('express')

// INSTANTIATE EXPRESS ROUTER
const api = express.Router()

// REQUIRE FILES
const planetsRouter = require('./planets')
const launchRouter = require('./launches')

// ALL ROUTES
api.use('/planets', planetsRouter)
api.use('/launches', launchRouter)

module.exports = api
