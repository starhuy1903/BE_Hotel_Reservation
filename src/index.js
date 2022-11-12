const path = require('path')
const os = require('os')

const express = require('express')
const app = express()
const db = require("./config/db")
const route = require("./routes")
const cookieParser = require("cookie-parser")
const cors = require('cors')



//static
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}))


//HTTP logger
const morgan = require('morgan')
app.use(morgan('combined'))


//cors
const whitelist = ['http://localhost:3000', 'http://127.0.0.1:8800', 'http://localhost:8800']
const corsOptions = {
    origin: whitelist,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

db.connect()

app.use(cookieParser())
app.use(express.json())

route(app)

app.listen(8800, ()=>{
    console.log("connected to server")
})


