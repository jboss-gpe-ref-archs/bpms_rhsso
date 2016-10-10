var http = require('http');
var bodyparser = require('body-parser');
var ENV = require('../../config').ENV;

module.exports = function(app) {

    app.use(bodyparser.json());
    app.post('/api/create', function(req,res) {
        var endpoint = "/kie-server/services/rest/server/containers/"
            + ENV.kieserver_containerId
            + "/processes/"
            + ENV.kieserver_processId
            + "/instances";
        var ticket = req.body;
        var headers = {
            'Accept': 'application/json',
            'Authorization': req.headers['authorization'],
            'Content-Type': 'application/json'
        };
        var options = {
            host: ENV.kieserver_host,
            port: ENV.kieserver_port,
            path: endpoint,
            method: "POST",
            headers: headers
        };
        var kieserverReq = http.request(options, function(kieserverRes) {
            kieserverRes.setEncoding('utf-8');
            var responseString = '';
            kieserverRes.on('data', function(data) {
                responseString += data;
            });

            kieserverRes.on('end', function() {
                res.status(201);
                res.type('json');
                res.send(responseString);
            });
        });
        kieserverReq.write(JSON.stringify(ticket));
        kieserverReq.end();
        kieserverReq.on('error', function(error) {
            res.send(error);
        });        
    });
}