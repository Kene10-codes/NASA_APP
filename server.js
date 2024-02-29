const http = require('http')
const app = require('./app')
const { mongooseConnect } = require('./services/mongo')

// SET Port
const PORT = process.env.PORT || 3300

// Import Files
const { loadPlanetsData } = require('./models/planetModel')
const { loadLaunchData } = require('./models/launchModel')
const server = http.createServer(app)

// Start Server Func
async function startServer() {
    await mongooseConnect()
    await loadLaunchData()
    await loadPlanetsData()

    // LISTEN TO SERVER
    server.listen(PORT, () => {
        console.log(`Server is starting on port ${PORT}`)
    })
}

// Invoke Server Function
startServer()
