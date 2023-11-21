const Router = require('express')
const router = new Router()
const parserRouter = require('./parser.router')
const userInfoController = require("../controllers/user_info.controller");



router.use('/parser', parserRouter)
router.get('/', userInfoController.statistic)
module.exports = router
