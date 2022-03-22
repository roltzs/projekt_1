var express = require('express');
var cors = require('cors');
var app = express();
var PORT = process.env.PORT || 3000;
var apiController=require('./controllers/apiController');
app.use(cors());
apiController(app);

app.get('/', function (req, res) {
 res.send('Hello, World');
});

app.get('/tere', function (req, res) {
    res.send('Tere, Maailm');
   });

app.listen(PORT);

//app.listen(3000);