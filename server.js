const http = require('http')
const app = require('./app')
const PORT = 3200

const server = http.createServer(app)

// Start Server Func
function startServer() {
    server.listen(PORT, () => {
        console.log(`Server is starting on port ${PORT}`)
    })
}

// Invoke Server Func
startServer()
