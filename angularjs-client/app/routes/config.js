var ENV = require('../../config').ENV;

module.exports = function(app) {

    app.get('/api/config', function(req,res) {

        var config = { 
            'rhsso_host' : ENV.rhsso_host, 
            'rhsso_port'  : ENV.rhsso_port,
            'rhsso_realm' : ENV.rhsso_realm,
            'rhsso_clientId' : ENV.rhsso_clientId,
            'rhsso_secret' : ENV.rhsso_secret
        };
        res.status(200);
        res.type('json');
        res.send(config);
    });
}