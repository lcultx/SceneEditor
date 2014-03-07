/**
 * Created by ELatA on 14-2-19.
 */
var fs = require('fs');
var mogDae = require('../tools/mogdae.js');
var uuid = require('node-uuid');

exports.routes = function(app){
    app.get('/dae/upload',function(req,res){
        res.render("upload");
    });
    app.post('/dae/upload',function(req,res){
        // 获得文件的临时路径
        var listDaeFiles = function(){
            res.redirect('/dae/list');
        }
        var tmpPath = req.files.daeFile.path;
        // 指定文件上传后的目录 - 示例为"images"目录。
        var targetPath = './upload/dae/' + req.files.daeFile.name;
        // 移动文件
        fs.rename(tmpPath, targetPath, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件,
            fs.unlink(tmpPath, function() {
                if (err) throw err;
                mogDae.serializeStore(targetPath,function(err,result){
                   res.json(result);
                })
            });
        });
    });
    app.get('/dae/list',function(req,res){
        var files = fs.readdirSync('./upload/dae');
        var result = [];
        files.forEach(function(filename){
            result.push({
                name:filename
            })
        });
        console.log(files);
        res.render('list-dae',{daeFiles:result});
    });

    app.get('/dae/:filename',function(req,res){

    });
    app.get('/dae/:filename/json',function(req,res){
        var filename = req.params.filename;
        daeTools.readAsJson('./upload/dae/' + filename).then(function(result){
            res.json(result);
        });
    });
    app.get('/dae/node/:filename/json',function(req,res){
        var filename = req.params.filename;
        daeTools.readAsJson('./upload/dae/' + filename,function(result){
            var dae = result.COLLADA;
            var nodes = [];
            for(var nodeKey in dae){
                var node = dae[nodeKey];
                nodes.push({id:uuid.v1(),name:nodeKey,isParent:true});
            }
            res.json(nodes);
        });

    });
    app.get('/dae/node/file/:filename/element/:uuid/json',function(req,res){
        var filename = req.params.filename;
        daeTools.readAsJson('./upload/dae/' + filename,function(result){
            var dae = result.COLLADA.library_geometries;
            var nodes = [];
            for(var nodeKey in dae){
                var node = dae[nodeKey];
                nodes.push({id:uuid.v1(),name:nodeKey,isParent:true});
            }
            res.json(nodes);
        });
    });
    app.get("/dae/:filename/mesh.json",function(req,res){
        var filename = req.params.filename;
        daeTools.readAsJson('./upload/dae/' + filename,function(result){
            res.json( result.COLLADA.library_geometries);
        });

    });
}

function listFileInfo(daeFile){

};

