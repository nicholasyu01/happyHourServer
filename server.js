const mongoose = require('mongoose');

// connect to a local MongoDB database
mongoose.connect('mongodb+srv://admin:admin@happyhourcluster.aqtxpmq.mongodb.net/test', {useNewUrlParser: true, useUnifiedTopology: true});

// create a server
const express = require('express');
const app = express();

// define the schema for our database
const Schema = mongoose.Schema;


/////////////////////// USER
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

// create the model from the schema
const User = mongoose.model('User', userSchema);

// create a route to get all users
app.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json({users: users});
    }
  });
});

// create a route to add a user
app.post('/users', (req, res) => {
  const user = new User(req.body);
  user.save(err => {
    if (err) {
      console.log(err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json({user: user});
    }
  });
});


//////////////////////////// EVENT

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },

})

const Event = mongoose.model('Event', eventSchema);

app.get('/events', (req, res) => {
    Event.find({}, (err, events) => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else {
        res.status(200).json({events: events});
      }
    });
  });
  
app.post('/event', (req, res) => {
    const event = new Event(req.body);
    event.save(err => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else {
        res.status(200).json({event: event});
      }
  });
});




// start the server
app.listen(5001, () => {
  console.log('Server started on port 5001');
});