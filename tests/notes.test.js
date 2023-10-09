const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const { server } = require('../index.js')
const { initialNotes, nonExistingId, notesInDb, usersInDb } = require('./test_helper.js')
const bcrypt = require('bcrypt')

const Note = require('../models/note.js')
const User = require('../models/user.js')
const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes.map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray) // espera a que todas las operaciones async acaben
})

describe.skip('when theres initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe.skip('viewing a specific note', () => {
  test('a specific note can be viewed', async () => {
    const notesAtStart = await notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('a note can be updated', async () => {
    const notesAtStart = await notesInDb()
    const noteToUpdate = notesAtStart[0]

    const newNote = {
      content: 'this is the new content of the note',
      important: false
    }

    const updatedNote = await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(newNote)
      .expect(201)

    expect(updatedNote.body.content).toEqual(newNote.content)
    expect(updatedNote.body.important).toEqual(newNote.important)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(note => note.content)

    expect(contents).toContain('Aprendiendo FullStack JS')
  })
})

describe.skip('adding a note', async () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/awaitsimplifies making async calls',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await notesInDb()
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1)

    const contents = notesAtEnd.map(note => note.content)
    expect(contents).toContain('async/awaitsimplifies making async calls')
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await notesInDb()

    expect(notesAtEnd).toHaveLength(initialNotes.length)
  })
})

describe.skip('deletion of a note', async () => {
  test('a note can be deleted', async () => {
    const notesAtStart = await notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await notesInDb()
    expect(notesAtEnd).toHaveLength(initialNotes.length - 1)

    const contents = notesAtEnd.map(note => note.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
