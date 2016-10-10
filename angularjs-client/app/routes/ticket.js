var http = require('http');
var bodyparser = require('body-parser');
var ENV = require('../../config').ENV;

module.exports = function(app) {

    app.use(bodyparser.json());
    app.put('/api/tickets/:id/states/:op', function(req,res){

        var op = req.params.op;
        var ticket = req.params.id;
        var output = req.body;
        var endpoint = "/kie-server/services/rest/server/containers/"
            + ENV.kieserver_containerId
            + "/tasks/"
            + ticket
            + "/states/"
            + op
            + "?user=user1";
        var headers = {
            'Accept': 'application/json',
            'Authorization': req.headers['authorization']
        };
        var options = {
            host: ENV.kieserver_host,
            port: ENV.kieserver_port,
            path: endpoint,
            method: "PUT",
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

        kieserverReq.write(JSON.stringify(output));
        kieserverReq.end();
        kieserverReq.on('error', function(error) {
            res.send(error);
        });        

    });

    app.get('/api/tickets/:id', function(req, res) {

        var ticket = req.params.id;
        var endpoint = "/kie-server/services/rest/server/containers/"
            + ENV.kieserver_containerId
            + "/tasks/"
            + ticket
            + "?withInputData=true&withOutputData=true";
        var headers = {
            'Accept': 'application/json',
            'Authorization': req.headers['authorization']
        };
        var options = {
            host: ENV.kieserver_host,
            port: ENV.kieserver_port,
            path: endpoint,
            method: "GET",
            headers: headers
        };
        var kieserverReq = http.request(options, function(kieserverRes) {
            kieserverRes.setEncoding('utf-8');
            var responseString = '';
            kieserverRes.on('data', function(data) {
                responseString += data;
            });

            kieserverRes.on('end', function() {
                res.status(200);
                res.type('json');
                res.send(responseString);
            });
        });

        kieserverReq.end();
        kieserverReq.on('error', function(error) {
            res.send(error);
        });
    });

    app.put('/api/tickets/:id/save', function(req, res) {

        var ticket = req.params.id;
        var output = req.body;
        var endpoint = "/kie-server/services/rest/server/containers/"
                + ENV.kieserver_containerId
                + "/tasks/"
                + ticket
                + "/contents/output";
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': req.headers['authorization']
        };
        var options = {
            host: ENV.kieserver_host,
            port: ENV.kieserver_port,
            path: endpoint,
            method: "PUT",
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
        kieserverReq.write(JSON.stringify(output));
        kieserverReq.end();
        kieserverReq.on('error', function(error) {
            res.send(error);
        });
    });
}