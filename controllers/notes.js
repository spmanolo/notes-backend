const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response, next) => {
  try {
    const notes = await Note
      .find({})
      .populate('user', { username: 1, name: 1 })
    response.json(notes)
  } catch (e) {
    next(e)
  }
})

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    response.json(note)
  } catch (e) {
    next(e)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const newNote = request.body

  const newNoteToAdd = {
    content: newNote.content,
    important: newNote.important
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, newNoteToAdd, { new: true })
    response.status(201).json(updatedNote)
  } catch (e) {
    next(e)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (e) {
    next(e)
  }
})

notesRouter.post('/', async (request, response, next) => {
  const note = request.body

  const user = await User.findById(note.userId)

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString(),
    user: user._id
  })

  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote)
  } catch (e) {
    next(e)
  }
})

module.exports = notesRouter
