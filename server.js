const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const dbKey = require('./config/keys_dev').mongoURI;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

const business = require('./routes/api/businesses');
const events = require('./routes/api/events');
const categories = require('./routes/api/categories');
const stories = require('./routes/api/stories');

const lokals = require('./routes/api/lokals')

mongoose.set('useFindAndModify', false);
mongoose
  .connect(dbKey, { useNewUrlParser: true, useCreateIndex: true})
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log(err));
// Use middleware: Passport and perform configuration
app.use(passport.initialize());
require('./config/passport')(passport);

// Use End user Routes
app.use('/api/users', users);
app.use('/api/profile', profile);

app.use('/api/business', business);
app.use('/api/events', events);
app.use('/api/stories', stories);
//Admin API
app.use('/api/admin/categories', categories);
app.use('/api/lokals', lokals);

// Server static assets in production
if (process.env.NODE_ENV === 'production'){
  // set static folder
  app.use(express.static('client/build'));
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

app.listen(port, () => console.log(`Running on PORT:${port}`));