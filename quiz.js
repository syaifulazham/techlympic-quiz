const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');

const api = require("./routes/crud");
const cyp = require("./routes/cypher");

let __DATA__SCHEMA__ = 'techlympic';

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//console.log('directory name-path: ',path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for rendering the map page
app.get('/', (req, res) => {
  res.render('quiz');
});

app.get('/cypher', (req, res) => {
var soalan = 'IBARAT PADI, MAKIN TUNDUK MAKIN BERISI';
  res.render('cypher', {soalan: cyp.encodeMessage(soalan)});
});

app.post('/api/quiz/qustions', (req, res) =>{
  api.quiz.questions((data)=>{
    res.send(data);
  })
});

app.post('/api/cypher/clue', (req, res) => {
  var pembayang = [
      ['AIR, API, TANAH',3],
      ['Abjad diwakili oleh 3 jujukan abjad dan angka (alphanumeric)', 2],
      ['Huruf vowel didahului oleh huruf v', 2],
      ['Huruf konsonan didahului oleh huruf c', 2],
      ['Peribahasan berkenaan orang yang berilmu', 3]
    ];

  var clue = req.body.clueid;
  var r = {};
  if((clue*1) === 0){
    r = {
      clueid: 0,
      message: pembayang[clue][0],
      encoded: cyp.encodeMessage(pembayang[clue][0]),
      multiplier: pembayang[clue][1]
    }
  }else{
    r = {
      clueid: clue,
      message: pembayang[clue][0],
      multiplier: pembayang[clue][1]
    }
  }

  res.send(r);
});



// Start the server

app.listen(process.env.APPLICATION_PORT, function () {
  console.log('Server started on port ' + process.env.APPLICATION_PORT);
});
