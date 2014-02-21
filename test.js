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
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var db = new Db('test', new Server('127.0.0.1', 27017),{w: 1});
// Establish connection to db
db.open(function(err, db) {
    // Create a new grid instance
    if(err){
        console.log(err);
    }
    var grid = new Grid(db, 'fs');
    // Some data to write
    var originalData = new Buffer('Hello world');
    // Write data to grid
    grid.put(originalData, {}, function(err, result) {
        // Fetch the content
        grid.get(result._id, function(err, data) {
            assert.deepEqual(originalData.toString('base64'), data.toString('base64'));

            db.close();
        });
    });
});

