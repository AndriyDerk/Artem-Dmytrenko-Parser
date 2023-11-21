const Router = require('express')
const router = new Router()
const parserController = require('../controllers/parser.controller')

router.post('/callback', parserController.callback)

module.exports = router
