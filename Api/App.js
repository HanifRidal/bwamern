const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect } = require("./db.js");
const pemesanRoutes = require("./Routes/PemesanController.js");
const wisataRoutes = require("./Routes/WisataController.js");
const cbfRoutes = require("./Routes/CbfController.js");
const userRoutes = require("./Routes/UserController.js");
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true // Allow cookies to be sent
}));
connect()
  .then((connection) => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.log("Database connection failed!");
    console.log(error);
  });

app.use("/Api", cbfRoutes);

app.use("/pemesan", pemesanRoutes)

app.use("/Api/wisata", wisataRoutes)
app.use("/Api/user", userRoutes);

app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});