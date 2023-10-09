const Note = require('../models/note.js')
const User = require('../models/user.js')

const initialNotes = [
  {
    content: 'Aprendiendo FullStack JS',
    important: true,
    date: new Date()
  },
  {
    content: 'Hoy es domingo',
    important: false,
    date: new Date()
  }
]

async function nonExistingId() {
  const note = new Note({
    content: 'willremovethissoon',
    date: new Date()
  })
  await note.save()
  await note.remove()

  return note._id.toString()
}

async function notesInDb() {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

async function usersInDb() {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb
}
