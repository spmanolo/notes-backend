const config = require('./utils/config.js')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes.js')
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middlewares.js')
const logger = require('./utils/logger.js')
const mongoose = require('mongoose')

// logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.connectionString)
  .then(() => {
    logger.info('Database connect')
  }).catch(err => {
    logger.error('error connecting to MongoDB:', err.message)
  })

app.use(express.json())
app.use(cors())
app.use(requestLogger)

app.use('/api/notes', notesRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
