const Router = require('express')
const router = new Router()
const parserRouter = require('./parser.router')


router.use('/parser', parserRouter)
router.get('/', (req, res) => {
    console.log("Ok")
    res.send('Artem-Dmytrenko-Parser')
})
module.exports = router
