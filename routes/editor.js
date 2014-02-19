/**
 * Created by ELatA on 14-2-19.
 */
exports.routes = function(app){
    app.get('/editor',function(req,res){
        res.render('editor');
    })
}