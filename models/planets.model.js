const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Planet Schema
const planetSchema = new Schema({
    keplerName: {
        type: String,
        required: true,
    },
})

const Planets = mongoose.model('Planet', planetSchema)

module.exports = Planets
