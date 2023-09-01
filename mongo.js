const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_URI

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connect')
  }).catch(err => {
    console.log(err)
  })

// desconectar cuando haya algun error
process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
