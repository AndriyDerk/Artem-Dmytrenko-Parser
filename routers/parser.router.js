const Router = require('express')
const router = new Router()
const courseController = require('../controllers/parser.controller')
router.post('/callback', courseController.callback)

module.exports = router
