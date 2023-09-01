const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note

// const note = new Note({
//   content: 'MongoDB es increible',
//   date: new Date(),
//   important: true
// })

// note.save()
//   .then(result => {
//     console.log(result)
//     console.log('note saved!')
//     mongoose.connection.close()
//   })
//   .catch(err => {
//     console.eror(err)
//   })

// Note.find({})
//   .then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })
//   .catch(err => {
//     console.error(err)
//   })
