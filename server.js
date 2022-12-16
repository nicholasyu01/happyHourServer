const mongoose = require('mongoose');
const cors = require('cors');

// connect to a local MongoDB database
mongoose.connect('mongodb+srv://admin:admin@happyhourcluster.aqtxpmq.mongodb.net/test', {useNewUrlParser: true, useUnifiedTopology: true});

// create a server
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());

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
    people: {
      type: Array,
      required: false
    },
    poll: {
      type: Array,
      required: false
    }

})

const Event = mongoose.model('Event', eventSchema);

app.get('/api/events', (req, res) => {
    Event.find({}, (err, events) => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else {
        res.status(200).json({events: events});
      }
    });
  });

app.get('/api/event/:id', (req, res) => {
  const id = req.params.id;
  Event.findById(id, (err, event) => {
    if (err) {
      console.log(err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json({event: event});
    }
  });
});
  
app.post('/api/event', (req, res) => {
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

app.post('/api/event/addPerson', (req, res) => {
  Event.findByIdAndUpdate(
    req.body.id,
    { 
      $push: {
        people: {
        name: req.body.name,
        }
      }
    },
    err => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else {
        console.log("sucess");
        res.status(200).json("success");
      }
  });
});

app.post('/api/event/removePerson', (req, res) => {
  Event.findByIdAndUpdate(
    req.body.id,
    { 
      $pull: {
        people: {
        name: req.body.name,
        }
      }
    },
    err => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else {
        console.log("sucess");
        res.status(200).json("success");
      }
  });
});

app.post('/api/event/addVote', (req, res) => {
  Event.update( {_id: req.body.id, "poll.pollItem": req.body.pollItem},
  {
    $set: {
        "poll.$.pollItem": req.body.pollItem,
        "poll.$.votes": req.body.votes + 1,
     }
  },
    err => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else {
        console.log("sucess");
        res.status(200).json("success");
      }
  });
});

app.post('/api/event/removeVote', (req, res) => {
  Event.update( {_id: req.body.id, "poll.pollItem": req.body.pollItem},
  {
    $set: {
        "poll.$.pollItem": req.body.pollItem,
        "poll.$.votes": req.body.votes - 1,
     }
  },
    err => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else {
        console.log("sucess");
        res.status(200).json("success");
      }
  });
});






const port = process.env.PORT || 5001;

// start the server
app.listen(port, () => {
  console.log('Server started on port 5001');
});