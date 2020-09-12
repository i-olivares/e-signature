const express = require("express");
const path = require("path")
const mysql = require("mysql");
const dotenv= require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session")
dotenv.config({path:'./.env'});

const app = express();
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST, // IP adress in server
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public')
const jsDirectory = path.join(__dirname, './js')
app.use(express.static(publicDirectory))
app.use(express.static(jsDirectory));
// Pase URL-encoded bodies
app.use(express.urlencoded({extended:false}))
// Parse JSON bodies
app.use(express.json())
app.use(cookieParser())

app.set('view engine','hbs');

app.use(session({
  secret: 'login-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:60*1000*30
  }
}));


db.connect((error) =>{
  if(error){
    console.log(error)
  } else {
    console.log("MYSQL connected...")
  }
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'))

app.listen(8080,() =>{
  console.log("server started on port 8080")
})
