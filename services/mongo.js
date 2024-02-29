const mongoose = require('mongoose')

const MONGO_DB_URL =
    'mongodb+srv://NASA:NASa12345@nodetut.n6pqp.mongodb.net/launchDB?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('MONGO DB CONNECTED')
})

mongoose.connection.on('error', (err) => {
    console.error(err, 'Error has occured')
})

async function mongooseConnect() {
    mongoose.connect(MONGO_DB_URL)
}

// Export mongooseConnect Function
module.exports = {
    mongooseConnect,
}
