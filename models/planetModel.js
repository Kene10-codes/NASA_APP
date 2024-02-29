const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const planets = require('./planets.model')
const Planets = require('./planets.model')
// Function to return habitable planets
function isInhabitable(planet) {
    return (
        planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 &&
        planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6
    )
}

// GET All Planets
async function getAllPlanets() {
    return await Planets.find({}, { __v: 0 })
}

// Function to load planets data
function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', 'data', 'parse.csv'))
            .pipe(
                parse({
                    comment: '#',
                    columns: true,
                })
            )
            .on('data', async (data) => {
                if (isInhabitable(data)) {
                    await savePlanet(data)
                }
            })
            .on('error', (err) => {
                console.log(err, 'There is an error!')
                reject(err)
            })
            .on('end', async () => {
                const findPlanets = (await getAllPlanets()).length
                console.log(`Total Inhabitable Planets are ${findPlanets}`)
                resolve()
            })
    })
}

// Save Planets Function
async function savePlanet(data) {
    try {
        await Planets.updateOne(
            {
                keplerName: data.kepler_name,
            },
            { keplerName: data.kepler_name },
            { upsert: true }
        )
    } catch (err) {
        console.error(err)
    }
}

// Export Functions/Module
module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
