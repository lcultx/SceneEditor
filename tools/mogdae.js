/**
 * Created by ELatA on 14-3-6.
 */


var fs = require('fs');
var xml2js = require('xml2js');
var when = require('when');
var uuid = require('node-uuid');
var async = require('async');
var forEach = require('async-foreach').forEach;

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




function Node(){
//type
//uuid
//getChildUUIDArray();
//getChildChildNodeArray();
//get Child
//

}

function MogDAE(){
//
}



function LinkNode(nodeKey,nodeValue){


    this.nodeKey = nodeKey;
    this.nodeValue = nodeValue;
    this.uuid = uuid.v1();
    this.data = {
        _key:this.nodeKey,
        parent:{
            key:"",//这个值暂时不记录了 需要的话下次重构的时候再加吧
            uuid:""
        },
        children:[]
    }
}


LinkNode.prototype.save = function(){

}

function BinaryNode(nodeType,nodeValue){
    this.dataType = nodeType;
    this.nodeValue = nodeValue;
    this.uuid = uuid.v1();
    this.parentUUID;
    this.parentKey;
}

BinaryNode.prototype.save = function(){

}

//TODO
BinaryNode.Type = {};

//LinkNodeArray






var dbErrorCatch = function(err){
    console.dir(err);
}



function serializeSensor(doc){
    var sensorResult = {
        ROOT:{},
        linkNode:new Array(),
        binaryNode:new Array()
    };

    function _serialize(thisNode){

        var nodeKey = thisNode.nodeKey;
        var nodeValue = thisNode.nodeValue;

        var isFloatArrayNode =  nodeKey === "float_array";
        var isIntArrayNode = nodeKey === "vcount" || nodeKey === "p" || nodeKey === "v" || nodeKey === "bind_shape_matrix";
        var isHaveChildNode = nodeKey === "COLLADA" || typeof nodeValue === "object";



        if(isFloatArrayNode){
            for(var key in nodeValue){
                var bin = new BinaryNode("float",nodeValue);
                bin.parentUUID = thisNode.uuid;
                bin.parentKey = thisNode.nodeKey;
                sensorResult.binaryNode.push(bin);
                thisNode.data.children.push({key:key,uuid:bin.uuid});
            }
            //thisNode.nodeValue = [];
        }else if(isIntArrayNode){
            var bin = new BinaryNode("int",nodeValue);
            bin.uuid = thisNode.uuid;
            sensorResult.binaryNode.push(bin);
            //thisNode.nodeValue = "";
        }else if(isHaveChildNode){
            for(var key in nodeValue){
                var _thisNode = new LinkNode(key,nodeValue[key]);

                _thisNode.data.parent = {
                    key:thisNode.nodeKey,
                    uuid:thisNode.uuid
                }
                thisNode.data.children.push({key:key,uuid:_thisNode.uuid});
                _serialize(_thisNode);
            }
        }
        sensorResult.linkNode.push(thisNode);
    }

    var Root = new LinkNode("COLLADA",doc.COLLADA);
    sensorResult.ROOT = Root;
    _serialize(Root);
    return sensorResult;
}

function parallelStore(sensorResult,callback){
    ////将node , binary分别存储
    //需要先存bin 再存node ，存储bin之后需要剔除节点中的数据
    async.series({
            binaryPersistence:function(callback){
                forEach(sensorResult.binaryNode,function(bin,callback){
                    grid.put(new Buffer(bin.nodeValue[0]),{_id:bin.uuid},function(){});
                },function(err){
                    callback(null, {success:true});
                });
            },
            linkNode:function(callback){
                forEach(sensorResult.linkNode,function(node,callback){
                    var collection = db.collection('linkNode');
                    console.log(node.data);
                    collection.insert(node.data,{_id:node.uuid},function(){});

                },function(err){
                    callback(null,{success:true});
                })
            }
        },
        function(err, results){
            callback(err,results);
        });

}

function serializeStore(daeFile,finalCallback){
    async.waterfall([
        //读取dae文件
        function(callback){
            fs.readFile(daeFile,function(err,data){
                callback(err,data);
            });
        },
        // 将dae解析为json
        function(data,callback){
            var parser = new xml2js.Parser();
            parser.parseString(data,function(err,doc){
                callback(err,doc);
            });
        },
        //遍历json解析node ,link ,binary
        function(doc,callback){
            var sensorResult = serializeSensor(doc);
            callback(null,sensorResult);
        },
        //存储前再做一次校验 TODO
        function(sensorResult,callback){
           // console.log(sensorResult);
            callback(null,sensorResult);
        },
        //存储
        function(sensorResult,callback){
            parallelStore(sensorResult,function(err,result){
                callback(err,{
                    data:sensorResult,
                    result:result
                });
            });
        }


    ],function(err,result){
        //console.log(result);
        finalCallback(err,result);
    });
}



exports.serializeStore = serializeStore;