var express = require('express');
var app     = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

require('./app/routes/mytickets')(app);
require('./app/routes/create')(app);
require('./app/routes/ticket')(app);
require('./app/routes/config')(app);

app.listen(8000);
console.log('Magic happens on 8000');

exports = module.exports = app;