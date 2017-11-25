var express = require('express')
var bodyParser = require('body-parser');
var judge = require('./judge.js')

var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use(function (err, req, res, next) {
	if (err.status == 400) {
		res.status(400).send('invalid JSON');
	} else {
		next(err);
	}
});

app.get('/', function (req, res) {
	res.send('Welcome to court!')
})

app.post('/validate', function (req, res) {
	judge.judgeData(req.body, res);
});

app.listen(port, function () {
	console.log(`court is in session on port: ${port}`);
})
