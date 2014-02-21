/**
 * Created by ELatA on 14-2-21.
 */
/**
 * Created by ELatA on 14-2-21.
 */

var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code;


var db = new Db('test', new Server('127.0.0.1', 27017),{w: 1});


exports.put = function(obj,callback,next){
    db.open(function(err, db) {
        // Create a new grid instance
        if(err){
            next(err);
        }
        var grid = new Grid(db, 'fs');
        // Write data to grid
        grid.put(obj, {}, function(err, result) {
            if(err){
                next(err);
            }else{
                callback(result);
            }
        });
    });
}


exports.get = function(obj,callback,next){
    db.open(function(err, db) {
        // Create a new grid instance
        if(err){
            next(err)
        }
        var grid = new Grid(db, 'fs');
        // Fetch the content
        grid.get(fileId, function(err, data) {
            if(err){
                next(err);
            }else{
                callback(data);
            }
            db.close();
        });
    });
}



