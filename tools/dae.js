/**
 * Created by blacksun on 14-2-19.
 */

var fs = require('fs');
var xml2js = require('xml2js');
var when = require('when');
var mongo = require('./MongoDB');
var grid = require('./MongoGrid');

//the default value is $ ,can't use this in mongodb
xml2js.defaults['0.2'].attrkey = '@';
xml2js.defaults['0.2'].attrkey = '@@';

function read(daeFile){
    var deferred = when.defer();
    var parser = new xml2js.Parser();
    fs.readFile(daeFile, function(err, data) {
        parser.parseString(data, function (err, doc) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(doc.COLLADA);
            }
        });
    });
    return deferred.promise;
};



function insert(db,daeFile){
    var deferred = when.defer();

    read(daeFile).then(function(dae){
        var collection = db.collection('dae');
       /* jsonStr = JSON.stringify(dae);
        console.log(jsonStr);
        dae = JSON.parse(jsonStr.replaceAll("$","dollar"));*/
        collection.insert({"dae":dae}, {w:1}, function(err, result) {
            if(!err){
                deferred.resolve(result);
            }else{
                if(err.message == "Document exceeds maximum allowed bson size of 16777216 bytes"){
                    grid.put(dae,function(result){
                        console.log(result);
                    },function(err){
                        console.log(err);
                    })
                }
                console.dir(err);
                deferred.reject(err);
            }
        });
    });
    return deferred.promise;
}


function simpleStoreInMongo(daeFile){
    var deferred = when.defer();
    mongo.conn().then(function(db){
        insert(db,daeFile).then(function(result){
            deferred.resolve(result);
        })
    });
    return deferred.promise;
}

exports.readAsJson = read
exports.simpleStore = simpleStoreInMongo