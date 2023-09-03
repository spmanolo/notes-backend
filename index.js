const app = require('./app.js')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`)
})
