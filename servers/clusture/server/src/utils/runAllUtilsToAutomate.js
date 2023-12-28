cleanupDbDirectory = require('./cleanDB')

cleanupDbDirectory()
setInterval(cleanupDbDirectory, 500);