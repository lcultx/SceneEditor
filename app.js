/**
 * Created by ELatA on 14-2-19.
 */

var http = require('http');
var path = require('path');
var express = require('express');

var app = express();

//set env
app.set('port',process.env.PORT || 1234);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname,'public')));

//dev
if('development' == app.get('env')){
    app.use(express.errorHandler());
}

//routes
var routes = require('./routes');
routes(app);

//run
http.createServer(app).listen(app.get('port'),function(){
   console.log('SceneEditor Server listening on port ' + app.get('port'));
});