/**
 * Created by ELatA on 14-2-19.
 */
var fs = require('fs');
var daeTools = require('../tools/dae.js');
exports.routes = function(app){
    app.get('/dae/upload',function(req,res){
        res.render("upload");
    });
    app.post('/dae/upload',function(req,res){
        // 获得文件的临时路径
        var tmp_path = req.files.daeFile.path;
        // 指定文件上传后的目录 - 示例为"images"目录。
        var target_path = './upload/dae/' + req.files.daeFile.name;
        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件,
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.send('File uploaded to: ' + target_path + ' - ' + req.files.daeFile.size + ' bytes');
            });
        });
    });
    app.get('/dae/list',function(req,res){
        var files = fs.readdirSync('./upload/dae');
        console.log(files);
        res.render('list-dae',{daeFiles:files});
    });
    app.get('/dae/:filename',function(req,res){

    });
    app.get('/dae/:filename/json',function(req,res){
        var filename = req.params.filename;
        daeTools.readAsJson('./upload/dae/' + filename,function(result){
            res.json(result);
        });
    });
    app.get("/dae/:filename/mesh.json",function(req,res){
        var filename = req.params.filename;
        daeTools.readAsJson('./upload/dae/' + filename,function(result){
            res.json( result.COLLADA.library_geometries);
        });

    });
}

