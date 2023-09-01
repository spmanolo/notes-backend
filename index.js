require('dotenv').config()
require('./mongo.js')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note.js')

app.use(express.json())
app.use(cors())

let notes = []

app.get('/', (request, response) => {
  response.send('<h1>Hola</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  // const id = Number(request.params.id)
  // const note = notes.find(note => note.id === id)

  // if (note) {
  //   response.json(note)
  // } else {
  //   response.status(404).end()
  // }

  const { id } = request.params

  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      console.log(err)
      response.status(400).end()
    })
})

// NO ACTUALIZADA PARA DB
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

// NO ACTUALIZADA PARA DB
app.put('/api/notes/:id', (request, response) => {
  const noteId = Number(request.params.id)
  const note = notes.find(note => note.id === noteId)
  const newNote = request.body

  if (!newNote || !newNote.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNoteToAdd = {
    id: noteId,
    content: newNote.content,
    date: new Date().toISOString(),
    important: typeof newNote.important !== 'undefined' ? newNote.important : note.id
  }

  console.log(newNoteToAdd)

  notes = notes.filter(note => note.id !== noteId)
  notes = [...notes, newNoteToAdd]

  response.status(201).json(newNote)
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
  })

  newNote.save()
    .then(savedNote => {
      response.status(201).json(savedNote)
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
