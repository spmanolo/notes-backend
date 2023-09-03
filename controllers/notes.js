const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const newNote = request.body

  const newNoteToAdd = {
    content: newNote.content,
    important: newNote.important
  }

  const updatedNote = await Note.findByIdAndUpdate(id, newNoteToAdd, { new: true })
  response.status(201).json(updatedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.post('/', async (request, response, next) => {
  const note = request.body

  // if (!note || !note.content) {
  //   return response.status(400).json({
  //     error: 'note.content is missing'
  //   })
  // }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  })

  const savedNote = await newNote.save()
  response.json(savedNote)
})

module.exports = notesRouter
