const app = require('./app.js')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')

const port = process.env.PORT || config.port

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})

module.exports = {
  server
}
