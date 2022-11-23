require('dotenv').config()
const path = require('path')
const os = require('os')
const express = require('express')
const app = express()
const db = require("../config/db")
const route = require("../routes")
const cookieParser = require("cookie-parser")

db.connect()

app.use(cookieParser())
app.use(express.json())

route(app)

app.listen(8800, ()=>{
    console.log("connected to server")
})


