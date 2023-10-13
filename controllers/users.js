const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({})
      .populate('notes', { content: 1, date: 1 })
    response.status(200).json(users)
  } catch (e) {
    next(e)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!password) {
      next({
        name: 'ValidationError',
        message: 'Password is missing'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json(error)
  }
})

module.exports = usersRouter
