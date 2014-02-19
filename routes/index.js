/**
 * Created by ELatA on 14-2-19.
 */

var dae = require('./dae');
var gTIF = require('./gTIF');
var xxRuntime = require('./xx-runtime');

var editor = require('./editor');

module.exports = function(app){
    dae.routes(app);
    gTIF.routes(app);
    xxRuntime.routes(app);

    editor.routes(app);
    app.get('/',function(req,res){
        res.render('index');
    });
}