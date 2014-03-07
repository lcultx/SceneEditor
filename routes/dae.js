/**
 * Created by ELatA on 14-2-19.
 */
var fs = require('fs');
var uuid = require('node-uuid');
var DAE = require('../models/dae').DAE;
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
        // 指定文件上传后的目录。
        var fileName =  req.files.daeFile.name;
        var targetPath = './upload/dae/' + fileName;
        // 移动文件
        fs.rename(tmpPath, targetPath, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件,
            fs.unlink(tmpPath, function() {
                if (err) throw err;
                var dae = new DAE(targetPath);
                dae.name = fileName;
                dae.save(function(dbDAE){
                    listDaeFiles();
                })
            });
        });
    });
    app.get('/dae/list',function(req,res){
        DAE.listFiles(function(result){
            res.render('list-dae',{daeFiles:result});
        });
    });

    app.get('/dae/uuid/:uuid',function(req,res){
        var uuid = req.params.uuid;
        DAE.getNode(uuid,function(node){
            if(node){
                res.json(node);
            }else{
                DAE.getBinary(uuid,function(bin){
                    res.send(bin);
                });
            }
        })
    });


}

function listFileInfo(daeFile){

};

