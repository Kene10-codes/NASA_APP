const {
    scheduleNewLaunch,
    getAllLaunches,
    existLaunchWithID,
    abortLaunchByID,
} = require('../models/launchModel')
const { getPagination } = require('../services/query')

// GET LAUNCHES CONTROLLER
async function getHttpLaunches(req, res) {
    const { limit, skip } = getPagination(req.query)
    const launch = await getAllLaunches(limit, skip)
    res.status(200).json(launch)
}

// POST LAUNCH CONTROLLER
async function addHttpLaunches(req, res) {
    let launch = req.body

    // DESTRUCTURE LAUNCH OBJECT
    let { mission, target, rocket, launchDate } = launch

    if (!mission || !target || !rocket || !launchDate) {
        return res.status(401).json({
            error: 'Mission Launch Field!',
        })
    }

    // CONVERT LAUNCH DATE TO A NUMBER
    launchDate = new Date(launchDate)

    if (isNaN(launchDate)) {
        return res.status(400).json({
            error: 'Invalid Date Format',
        })
    }

    await scheduleNewLaunch(launch)

    res.status(201).json(launch)
}

async function deleteHttpLaunch(req, res) {
    const launchID = +req.params.id

    const existLaunch = await existLaunchWithID(launchID)
    if (!existLaunch) {
        res.status(404).json({
            error: 'Launch Does not exist',
        })
    }

    const aborted = await abortLaunchByID(launchID)
    if (!aborted) {
        res.status(404).json({
            error: 'Launch is not aborted!',
        })
    }

    res.status(200).json({
        acknowledged: true,
    })
}

module.exports = { getHttpLaunches, addHttpLaunches, deleteHttpLaunch }
