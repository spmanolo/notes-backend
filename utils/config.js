require('dotenv').config()
// const { PORT, MONGODB_URI, TEST_MONGODB_URI, NODE_ENV } = process.env

const port = process.env.PORT
let connectionString = process.env.MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.TEST_MONGODB_URI
}

module.exports = {
  port,
  connectionString
}
