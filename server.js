var fs = require('fs'),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser');

var APPS_FILE = path.join(__dirname, 'applications.json');

var app = express();

app.set('port', (process.env.PORT || 3001));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
  res.send('hello, world');
});

app.get('/apply', function(req, res) {
  res.sendFile(__dirname + "/public/apply.html");
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + "/public/login.html");
});

app.get('/api/applications', function(req, res) {
  fs.readFile(APPS_FILE, function(err, data) {
    if(err) {
      console.log(err);
      process.exit(1);
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/applications', function(req, res) {
  fs.readFile(APPS_FILE, function(err, data) {
    if(err) {
      console.log(err);
      process.exit(1);
    }

    var applications = JSON.parse(data);
    var newApp = {
        id: Date.now(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        year: req.body.year,
        school: req.body.school,
        email: req.body.email
      };
    applications.push(newApp);
    fs.writeFile(APPS_FILE, JSON.stringify(applications, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(applications);
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started at localhost:' + app.get('port'));
});
