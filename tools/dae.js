/**
 * Created by blacksun on 14-2-19.
 */

var fs = require('fs');
var xml2js = require('xml2js');
var when = require('when');
var uuid = require('node-uuid');

//the default value is $ ,can't use this in mongodb
xml2js.defaults['0.2'].attrkey = '@';
xml2js.defaults['0.2'].attrkey = '@@';

var MongoClient = require('mongodb').MongoClient;
var Grid = require('mongodb').Grid;
var db,grid;

MongoClient.connect("mongodb://localhost:27017/dae",function(err,_db){
    db = _db;
    grid = new Grid(db, 'fs');
});


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


function _isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function _isNumber(obj){
    return obj && !isNaN(parseInt(obj,10));
}

function _isString(obj){
    return Object.prototype.toString.call(obj) === '[object String]'
}

function _isIntArrayStrNode(obj){
    if(_isString(obj)){
        var tData = obj.substring(0,20);
        var tArray = tData.split(" ");
        if(_isNumber(tArray[0]) && _isNumber(tArray[1]) && _isNumber(tArray[2])){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    };
}

function _isIntArrayNode(nodeKey){
    return nodeKey === "vcount" || nodeKey === "p" || nodeKey === "v" || nodeKey === "bind_shape_matrix";
}

function _isFloatArrayNodes(nodeKey){
    return nodeKey === "float_array";
}

function _autoSaveIntArrayNode(){

}


function _autoSaveNode(db,parentUUID,thisUUID,childUUIDArray,nodeKey,nodeValue,callback,next){
    var nodeCollection = db.collection('node');
    var linkCollection = db.collection('link');
    nodeCollection.insert(nodeValue,{_id:thisUUID},function(){
        linkCollection.insert({parent:parentUUID,child:childUUIDArray},{_id:thisUUID},function(){});
    });
}

//这个地方的代码太丑陋了，要重新规划一下

function _serializeStore(db,parentUUID,thisUUID,childUUIDArray,nodeKey,nodeValue,callback,next){
    if(_isFloatArrayNodes(nodeKey)){ //can not get uuid from object loop
        var _childUUIDArray = new Array();
        for(var key in nodeValue){
            var childUUID = uuid.v1();
            _childUUIDArray.push(childUUID);
            grid.put(new Buffer(nodeValue[0]),{_id:chidUUID},function(){});
            _autoSaveNode(db,thisUUID,childUUID,[],key,nodeValue[key],callback,next);
        }
        _autoSaveNode(db,parentUUID,thisUUID,_childUUIDArray,nodeKey,nodeValue,callback,next);
    }else if(_isIntArrayNode(nodeKey)){
        grid.put(new Buffer(nodeValue[0]),{_id:thisUUID},function(){});
        _autoSaveNode(db,parentUUID,thisUUID,childUUIDArray,nodeKey,nodeValue,callback,next);
    }else if(nodeKey == "COLLADA" || typeof nodeValue == "object"){
        //_autoSaveNode(db,parentUUID,thisUUID,childUUIDArray,nodeKey,nodeValue,callback,next);
        var _childUUIDArray = new Array();
        for(var key in nodeValue){
            var childUUID = uuid.v1();
            _childUUIDArray.push(childUUID);
            _serializeStore(db,thisUUID,childUUID,_childUUIDArray,key,nodeValue[key],callback,next);
        }
    }
}

function _storeSerializedStruct(){

}

var dbErrorCatch = function(err){
    console.dir(err);
}


function simpleStore(daeFile){
    var deferred = when.defer();
    mongo.conn(function(db){
        insert(db,daeFile).then(function(result){
            deferred.resolve(result);
        })
    },dbErrorCatch);
    return deferred.promise;
}

//是不是该设置一个StoreKeeper类
//http://biyeah.iteye.com/blog/1308954 做on操作
function serializeStore(daeFile,callback,next){
    var parser = new xml2js.Parser();
    fs.readFile(daeFile, function(err, data) {
        parser.parseString(data, function (err, doc) {
            if(err){
                next(err);
            }else{
                _serializeStore(db,"",uuid.v1(),[],"COLLADA",doc.COLLADA,callback,next);
                _storeSerializedStruct(db,doc,callback,next);
            }
        });
    });
}


exports.readAsJson = read
exports.simpleStore = simpleStore
exports.serializeStore = serializeStore;