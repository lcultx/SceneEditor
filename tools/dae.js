/**
 * Created by blacksun on 14-2-19.
 */

var fs = require('fs');
var xml2js = require('xml2js');
var when = require('when');
var mongo = require('./MongoDB');

console.log(xml2js.defaults);
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
            if(err){
                console.dir(err);
                deferred.reject(err);
            }else{
                deferred.resolve(result);
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