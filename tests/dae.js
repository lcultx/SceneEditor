/**
 * Created by ELatA on 14-3-6.
 */
var assert = require("assert");
var daeTools = require('../models/dae.js');
/*describe('DAE', function(){
    describe('#serializeStore', function(){
        it('now error', function(){
 *//*           var daeFilePath = 'D:\\ELatA\\SceneEditor\\tests\\data\\cube_bone.dae';
            daeTools.serializeStore(daeFilePath);*//*
        })
    })
});*/

var daeFilePath = 'D:\\ELatA\\SceneEditor\\tests\\data\\cube_bone.dae';
daeTools.serializeStore(daeFilePath,function(err,res){
    if(res.result.binaryPersistence.success && res.result.linkNode.success){
        console.log(res.data.ROOT.uuid);
    }
});
