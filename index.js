const express = require('express');
const cors = require('cors')
const router = require('./routers/index')

const app = express();
const PORT = 5000

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))
app.use('/', router)
function start(){
    app.listen(PORT, ()=>{
        console.log(`Server started on port ${PORT}`)
    })
}

start();
