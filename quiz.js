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

app.post('/api/cypher/answered', (req,res) => {
  var soalan = 'IBARAT PADI, MAKIN TUNDUK MAKIN BERISI';
  var pembayang = [
      ['AIR, API, TANAH',1.5],
      ['Satu abjad diwakili oleh 3 jujukan abjad dan angka (alphanumeric)', 1.2],
      ['Huruf vokal didahului oleh huruf v dan diikuti oleh dua digit nombor', 1.2],
      ['Huruf konsonan didahului oleh huruf c dan diikuti oleh dua digit nombor', 1.2],
      ['Peribahasan berkenaan orang yang berilmu', 1.5]
  ];

  var ans = req.body.answer;

  var en = cyp.splitIntoThreeChars(cyp.encodeMessage(soalan));
  var an = ans.answer.split('');
  var pct = 0;

  console.log(en,ans.bonusesid);

  en.forEach((d, i)=>{
    console.log(cyp.symbolMapping[d][0],"==",an[0]);
    if(i>en.length-1){
      pct--;
    }else if(cyp.symbolMapping[d][0]==an[i]){
      pct++;
    }
  });

 ketepatan = Math.round(pct/en.length*100);
 nilai = ketepatan;
 ans.bonusesid.forEach(d=>{
  nilai*=pembayang[d*1][1];
 });
  res.send({points:{
    accuracy: Math.round(pct/en.length*100),
    points: Math.round(nilai),
    timetaken: ans.timetaken
  }})


})

app.post('/api/cypher/clue', (req, res) => {
  var pembayang = [
      ['AIR, API, TANAH',1.5],
      ['Satu abjad diwakili oleh 3 jujukan abjad dan angka (alphanumeric)', 1.2],
      ['Huruf vokal didahului oleh huruf v dan diikuti oleh dua digit nombor', 1.2],
      ['Huruf konsonan didahului oleh huruf c dan diikuti oleh dua digit nombor', 1.2],
      ['Peribahasan berkenaan orang yang berilmu', 1.5]
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
