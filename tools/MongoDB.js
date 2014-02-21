/**
 * Created by ELatA on 14-2-20.
 */

var MongoClient = require('mongodb').MongoClient;
var when = require('when');
function localConnection(){
    var deferred = when.defer();
    MongoClient.connect("mongodb://localhost:27017/test",function(err,db){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(db);
        }
    });
    return deferred.promise;
}



exports.conn = localConnection;