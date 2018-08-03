const actions = require('express').Router()
const db = require('../data/db')

actions.post('/', async (req, res, next) => {
  checkActionBody(req, next)

  const { body: action } = req

  try {
    const ids = await db('actions').insert(action)
    res.status(200).json({ id: ids[0], ...action })
  } catch(e) {
    sendError(500, e.message, next)
  }
})

actions.use((err, req, res, next) => {
  res.status(err.code).json({
    error: err.code,
    message: err.message
  })
})

function checkActionBody (req, next) {
  if (!req.body 
      || !req.body.projectId 
      || !req.body.description) {
    sendError(400, "please provide projectId and description", next)
  }
}

function sendError (code, message, next) {
  next({code, message})
}

module.exports = actions
