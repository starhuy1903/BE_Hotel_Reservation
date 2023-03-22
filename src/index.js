const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const db = require("./config/db");
const route = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const cron = require("node-cron");
const {
  updateSuccessReservation,
  updatePendingReservation,
} = require("./app/service/reservationStatus");
const bodyParser = require("body-parser");

cron.schedule("* * * * *", () => updateSuccessReservation());
cron.schedule("* * * * *", () => updatePendingReservation());

//static
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute)

//HTTP logger
const morgan = require("morgan");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan("combined"));

// Cross Origin Resource Sharing
app.use(credentials);
app.use(cors(corsOptions));

db.connect();

app.use(cookieParser());
app.use(express.json());

route(app);

app.listen(8800, () => {
  console.log("connected to server");
});
