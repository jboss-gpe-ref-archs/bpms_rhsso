var http = require('http');
var ENV = require('../../config').ENV;

module.exports = function(app) {

    app.get('/api/mytickets', function(req,res) {

        var page = req.query.page;
        var endpoint = "/kie-server/services/rest/server/queries/tasks/instances/pot-owners"
            + "?page=" + page
            + "&user=user1";
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

}

