/**
 * Created by ELatA on 14-2-19.
 */

var dae = require('./dae');
var gLTF = require('./gLTF');
var xxRuntime = require('./xx-runtime');

var editor = require('./editor');

module.exports = function(app){
    dae.routes(app);
    gLTF.routes(app);
    xxRuntime.routes(app);

    editor.routes(app);
    app.get('/',function(req,res){
        res.redirect('/dae/upload');
       // res.render('index');
    });
}