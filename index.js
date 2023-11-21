require('dotenv').config()
const express = require('express');
const cors = require('cors')
const router = require('./routers/index')
const parserService = require('./services/parser.service')

const app = express();
const PORT = 5000

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://e-amway.pl']
}))
app.use('/', router)
function start(){
    app.listen(PORT, ()=>{
        console.log(`Server started on port ${PORT}`)
    })
}

start();

let CronJob = require("cron").CronJob,
    job = new CronJob(
        "0 */1 * * *",
        async function () {
            await parserService.reRegister();
        },
        null,
        true
    );