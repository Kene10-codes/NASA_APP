const axios = require('axios')
const Launches = require('./launch.model')
const Planets = require('./planets.model')

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration 4',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 20, 2045'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    success: true,
    upcoming: true,
}

// DEFAULT FLIGHT NUMBER
const DEFAULT_FLIGHT_NUMBER = 100

// SPACEX URL
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateDatabase() {
    const responses = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    },
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    })

    const launchesDB = await responses.data.docs

    // ITERATE THROUGH RESPONSE
    for (const launchDB of launchesDB) {
        const payloads = launchDB['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDB['flight_number'],
            mission: launchDB['name'],
            launchDate: launchDB['date_local'],
            upcoming: launchDB['upcoming'],
            success: launchDB['success'],
            customers,
        }
    }

    await saveLaunch(launch)
}

// LOAD LAUNCH DATA
async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1',
    })

    if (firstLaunch) {
        throw new Error('Launch already exists!')
    } else {
        await populateDatabase()
    }
}

// SAVE LAUNCH
async function saveLaunch(launch) {
    try {
        await Launches.findOneAndUpdate(
            {
                flightNumber: launch.flightNumber,
            },
            { launch },
            { upsert: true }
        )
    } catch (err) {
        console.error(err)
    }
}

// GET ALL LAUNCHES
async function getAllLaunches(skip, limit) {
    try {
        return await Launches.find({}, { _id: 0, __v: 0 })
            .sort({
                flightNumber: 1,
            })
            .skip(skip)
            .limit(limit)
    } catch (err) {
        console.log(err, 'Unable To Fetch Launches')
    }
}

// FIND LAUNCH
async function findLaunch(filter) {
    return await Launches.findOne(filter)
}

// EXIST LAUNCH WITH ID
async function existLaunchWithID(launchID) {
    return await findLaunch({
        flightNumber: launchID,
    })
}

// GET HIGHEST FLIGHT NUMBER
async function getHighestFlightNumber() {
    const latestLaunch = await Launches.findOne().sort({ flightNumber: -1 })
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

// SCHEDULE NEW LAUNCH
async function scheduleNewLaunch(launch) {
    console.log(launch)
    const planet = await Planets.findOne({
        keplerName: launch.target,
    })

    if (!planet) {
        throw new Error('No Matching Planet Found!')
    }

    const hightFlightNumber = (await getHighestFlightNumber()) + 1

    const newLaunch = Object.assign(launch, {
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true,
        flightNumber: hightFlightNumber,
    })

    await saveLaunch(newLaunch)
}

// ABORT LAUNCH
async function abortLaunchByID(launchID) {
    const abortLaunch = await Launches.updateOne(
        {
            flightNumber: launchID,
        },
        {
            upcoming: false,
            success: false,
        },
        { upsert: true }
    )

    return abortLaunch.modifiedCount === 1 && abortLaunch.acknowledged == true
}

module.exports = {
    scheduleNewLaunch,
    existLaunchWithID,
    loadLaunchData,
    getAllLaunches,
    abortLaunchByID,
}
