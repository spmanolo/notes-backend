const config = require('./utils/config.js')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

// Controllers
const notesRouter = require('./controllers/notes.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')

// Middlewares
const requestLogger = require('./middlewares/requestLogger.js')
const unknownEndpoint = require('./middlewares/notFound.js')
const errorHandler = require('./middlewares/handleErrors.js')

const logger = require('./utils/logger.js')
const mongoose = require('mongoose')

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
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
