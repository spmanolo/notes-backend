const mongoose = require('mongoose')
const password = require('./password.js')

const connectionString = `mongodb+srv://manolosan2001:${password}@cluster-notas.m9kbse5.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connect')
  }).catch(err => {
    console.log(err)
  })
