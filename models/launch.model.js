const mongoose = require('mongoose')
const Schema = mongoose.Schema

const launchSchema = new Schema(
    {
        flightNumber: {
            type: Number,
            required: true,
        },
        launchDate: {
            type: Date,
        },
        mission: { type: String, required: true },
        rocket: { type: String, required: true },

        target: { type: String, required: true },
        customer: [String],
        success: {
            type: Boolean,
            required: true,
            default: true,
        },
        upcoming: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
)

const Launches = mongoose.model('Launch', launchSchema)

module.exports = Launches
