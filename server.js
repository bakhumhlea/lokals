const express = require('express');
const mongoose = require('mongoose');

const app = express();

const dbKey = require('./config/keys_dev').mongoURI;

mongoose
  .connect(dbKey, { useNewUrlParser: true})
  .then(() => console.log("mongoDB Atlas connected"))
  .catch(err => console.log(err));

app.get('/', (req,res) => res.send('Welcome to Lokals'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Running on PORT:${port}`));