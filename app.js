const path = require("path");
const express = require("express");
var exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// require("dotenv").config();S

app.use(cors())

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static("public"));

// view engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");



// Mongoose
// database connection

mongoose.connect("mongodb+srv://jayrk:hello@cluster0.s4ouq.mongodb.net/inshare?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We are connected");
});



                                                                                                                                                                                                         
// Routes
app.get('/',function(req,res){
  res.render("index",{baseUrl : process.env.APP_BASE_URL});
})


app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'))







// server
app.listen(port, () => {
  console.log(`Server runnin' on http://localhost:${port}`);
});
