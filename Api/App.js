const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect } = require("./db.js");
const pemesanRoutes = require("./Routes/PemesanController.js");
const wisataRoutes = require("./Routes/WisataController.js");
const cbfRoutes = require("./Routes/CbfController.js");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

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

app.use("/Api", wisataRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});