const Router = require('express')
const router = new Router()
const parserRouter = require('./parser.router')


router.use('/parser', parserRouter)
router.get('/', (req, res) => {
    res.send('Artem-Dmytrenko-Parser parser')
})
module.exports = router
