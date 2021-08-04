require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const mySecret = process.env['MONGO_URI'];
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });
const dns = require('dns');
const urlModule = require('url'); //this and the line below it are some ugly copypasta to try and get the DNS lookup to work. I'm presuming the URL module was the missing item. 
const URL = urlModule.URL;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// First API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});



//Create URL schema

const { Schema } = mongoose;

const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  }
});


let URLstore = mongoose.model('URLstore', urlSchema);


//add a new URL to the database, and return a JSON w/ key
app.post('/api/shorturl', function (req, res) {
  if (urlValidityChecker(req.body.url)) { //respond with error object if URL isn't valid
    res.json({
      error: 'invalid url'
    });
  }

  let newEntry = new URLstore({
    original_url: req.body.url,
  });

  newEntry.save(function (error, data) {
    if (error) {
      return console.error(error, "URL didn't save");
    } else {
      // done(null, data);
      res.json({ original_url: data.original_url, short_url: data.id });
    }
  });
});


//test URL validity
function urlValidityChecker(toValidate) {
  if ((/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/).test(toValidate)) {
    return false;
  } else {
    console.error(toValidate, "URL is invalid, mistakes were made!")
    return true;
  }
}


//redirect to shortened URLs entered
app.get('/api/shorturl/:abridged', function (req, res) {
  URLstore.findById(req.params.abridged, function (err, data) {
    if (err) {
      console.error(err, "this abridged URL was not found");
      res.json({ reply: 'this abridged URL was not found' });
    } else {
      res.redirect(data.original_url);
    };
  });
});

