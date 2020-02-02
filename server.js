const express = require('express');
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/notes");

var noteSchema = new mongoose.Schema({
  noteId: String,
  name: String,
  desc: String
}, { collection: 'note' });

var IndividualNote = mongoose.model("NoteModel", noteSchema);

app.listen(3001, function () {
  console.log('listening on 3001')
})

app.get('/', (req, res) => {
  res.send('Hello World');
})
app.post('/saveNote', (req, res) => {
  var note_id = req.body.noteId;
  var note_name = req.body.name;
  var note_description = req.body.desc;
  console.log(JSON.stringify(req.body))
  var myNote = new IndividualNote(req.body);

  myNote.save().then(item => {
    res.send(JSON.stringify(item));
  }).catch(err => {
    res.status(400).send("unable to save to database");
  });
});

app.get('/viewnotes', (req, res) => {
  IndividualNote.find({}, 'name desc noteId', function (err, responsenotes) {
    if (err) return handleError(err);
    res.send(responsenotes)
  })
})

app.post('/editnote', (req, res) => {
  IndividualNote.findOneAndUpdate({ noteId: req.body.noteid }, {
    $set: {
      "name": req.body.name,
      "desc": req.body.desc

    }
  }, { new: true, useFindAndModify: false }).then((note) => {
    res.send(note)
  });
})

app.post('/getnotebyid', (req, res) => {
  IndividualNote.findOne({ noteId: req.body.noteid }, 'name desc noteId', function (err, responsenotes) {
    res.send(responsenotes)
  });
})
app.post('/deletebyid', (req, res) => {
  IndividualNote.deleteOne({ noteId: req.body.noteid }, function (err, respdelete) {
    res.send(respdelete)
  });
})