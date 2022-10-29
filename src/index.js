const path = require('path')
const os = require('os')

const express = require('express')
const app = express()
const db = require("./config/db")
const route = require("./routes")
const cookieParser = require("cookie-parser")
db.connect()

app.use(cookieParser())
app.use(express.json())

route(app)

app.listen(8800, ()=>{
    console.log("connected to server")
})


/*console.log(os.homedir())
console.log(os.type())
console.log(os.version())

console.log(__dirname)
console.log(__filename)

console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))

console.log("start");
setTimeout(() => console.log("settimeOut"), 0)
Promise.resolve().then(() => console.log("Promise"))
console.log("End")*/

