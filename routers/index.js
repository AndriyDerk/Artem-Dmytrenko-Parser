const Router = require('express')
const router = new Router()
const parserRouter = require('./parser.router')


router.use('/parser', parserRouter)


module.exports = router
