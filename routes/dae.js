/**
 * Created by ELatA on 14-2-19.
 */

exports.routes = function(app){
    app.get('/dae/upload',function(req,res){
        res.render("upload");
    });
    app.get('/dae/list',function(req,res){

    });
    app.get('/dae/daeId.json',function(req,res){

    });
}