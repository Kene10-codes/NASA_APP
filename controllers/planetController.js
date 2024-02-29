const { getAllPlanets } = require('../models/planetModel')

// GET All Planets Array
async function getHttpAllPlanets(req, res) {
    const getAllPlanet = await getAllPlanets()
    res.status(201).json(getAllPlanet)
}

module.exports = { getHttpAllPlanets }
