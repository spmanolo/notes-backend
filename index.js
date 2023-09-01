require('dotenv').config()
require('./mongo.js')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')

const Note = require('./models/Note.js')

app.use(express.json())
app.use(cors())

const notes = []

app.get('/', (request, response) => {
  response.send('<h1>Hola</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
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
      next(err)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => {
      next(err)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const newNote = request.body

  const newNoteToAdd = {
    content: newNote.content,
    important: newNote.important
  }

  Note.findByIdAndUpdate(id, newNoteToAdd, { new: true })
    .then(updatedNote => {
      response.status(201).json(updatedNote)
    })
    .catch(err => {
      next(err)
    })
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

// unknown endpoint
app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
