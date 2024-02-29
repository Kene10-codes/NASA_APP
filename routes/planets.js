const express = require('express')
const { getHttpAllPlanets } = require('../controllers/planetController')

// SET ROUTER INSTANCE
const router = express.Router()

router.get('/', getHttpAllPlanets)

module.exports = router
