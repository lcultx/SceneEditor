/**
 * Created by ELatA on 14-3-7.
 */




var daeTools = require('../tools/mogdae.js');

var MongoClient = require('mongodb').MongoClient;
var Grid = require('mongodb').Grid;
var db,grid;
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect("mongodb://localhost:27017/dae",function(err,_db){
    db = _db;
    grid = new Grid(db, 'fs');
});

function DAE(filePath){
    this.uuid = '';
    this.owner = '';
    this.name = '';
    if(filePath){
        this.filePath = filePath;
    }
}

DAE.prototype.save = function(callback){
    var dae = this;
    daeTools.serializeStore(this.filePath,function(err,res){
        if(res.result.binaryPersistence.success && res.result.linkNode.success){
            dae.uuid = res.data.ROOT.uuid;
            var collection = db.collection('uploadFiles');
            collection.insert(dae,{'_id_':dae.uuid},function(){
                if(callback){callback(dae);}
            });
        }
    })
}

DAE.listFiles = function(callback){
   db.collection('uploadFiles').find().toArray(function(err,docs){
       callback(docs);
   });
}

DAE.getNode = function(uuid,callback){
    db.collection('linkNode').findOne({'_uuid':uuid},function(err,result){
        callback(result);
    });
};

DAE.getBinary = function(uuid,callback){

   grid.get(new ObjectID(uuid),function(err,data){
       console.log(data);
       callback(data);
   })
}

exports.DAE = DAE;