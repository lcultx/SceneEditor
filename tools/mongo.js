/**
 * Created by ELatA on 14-2-21.
 */
/**
 * Created by ELatA on 14-2-20.
 */



var MongoClient = require('mongodb').MongoClient;
var Grid = require('mongodb').Grid;
var db,grid;

MongoClient.connect("mongodb://localhost:27017/dae",function(err,_db){
    db = _db;
    grid = new Grid(db, 'fs');
});

exports.db = db;
exports.grid = grid;