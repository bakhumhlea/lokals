const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const dbKey = require('./config/keys_dev').mongoURI;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

const business = require('./routes/api/business-profile');
const events = require('./routes/api/events');
const categories = require('./routes/api/categories');

mongoose.set('useFindAndModify', false);
mongoose
  .connect(dbKey, { useNewUrlParser: true})
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log(err));

// Use middleware: Passport and perform configuration
app.use(passport.initialize());
require('./config/passport')(passport);
  
app.get('/', (req,res) => res.send('Welcome to Lokals'));

//Use End user Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.get('/api/collections', (req, res) => res.send('Collection route'));

app.use('/api/business/', business);
app.use('/api/events', events);
//Admin API
app.use('/api/admin/categories', categories);

app.listen(port, () => console.log(`Running on PORT:${port}`));