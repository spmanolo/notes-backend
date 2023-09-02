const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.put('/:id', (request, response, next) => {
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
    .catch(next)
})

notesRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => {
      next(err)
    })
})

notesRouter.post('/', (request, response) => {
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

  newNote.save().then(savedNote => { response.json(savedNote) })
})

module.exports = notesRouter
