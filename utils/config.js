require('dotenv').config()
const { PORT, MONGODB_URI, TEST_MONGODB_URI, NODE_ENV } = process.env

const port = PORT
let connectionString = MONGODB_URI
if (NODE_ENV === 'test') {
  connectionString = TEST_MONGODB_URI
}

module.exports = {
  port,
  connectionString
}
