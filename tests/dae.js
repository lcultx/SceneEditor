/**
 * Created by ELatA on 14-3-6.
 */
var assert = require("assert");
var daeTools = require('../tools/mogdae.js');
var DAE = require('../models/dae').DAE;
/*describe('DAE', function(){
    describe('#serializeStore', function(){
        it('now error', function(){
 *//*           var daeFilePath = 'D:\\ELatA\\SceneEditor\\tests\\data\\cube_bone.dae';
            daeTools.serializeStore(daeFilePath);*//*
        })
    })
});*/

var daeFilePath = 'D:\\ELatA\\SceneEditor\\tests\\data\\cube_bone.dae';
/*daeTools.serializeStore(daeFilePath,function(err,res){
    if(res.result.binaryPersistence.success && res.result.linkNode.success){
        console.log(res.data.ROOT.uuid);
    }
});*/
var dae = new DAE(daeFilePath);
dae.name = "12345789";
dae.save(function(dbdae){
    console.log(dbdae);
});
var MongoClient = require('mongodb').MongoClient;
var Grid = require('mongodb').Grid;
var db,grid;
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect("mongodb://localhost:27017/dae",function(err,_db){
    db = _db;
    grid = new Grid(db, 'fs');
    uuid = "0b0eefbe-a5c7-11e3-ad3b-15a2d41d6e36";



    var originalData = new Buffer('Hello world');
    var uuid = new ObjectID().toString();
    // Write data to grid
    console.log(uuid);
  grid.put(originalData, {_id: new ObjectID(uuid)}, function(err, result) {

       grid.get(new ObjectID('531986744e25062c08f8e48e'), function(err, data) {
           console.log(err,data);
       });
   });

});
