'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var errorHandler = require('strong-error-handler');

var app = module.exports = loopback();
app.use(loopback.token({
    model: app.models.accessToken,
    currentUserLiteral: 'me'
}));

app.use(errorHandler({
    debug: true,
    log: true,
}));

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err) console.log(err);//throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});
