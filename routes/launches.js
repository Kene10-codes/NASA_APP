const express = require('express')
const {
    addHttpLaunches,
    getHttpLaunches,
    deleteHttpLaunch,
} = require('../controllers/launchController')

// SET ROUTER INSTANCE
const router = express.Router()

router.post('/', addHttpLaunches)
router.get('/', getHttpLaunches)
router.delete('/:id', deleteHttpLaunch)

module.exports = router
