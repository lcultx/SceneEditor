/**
 * Created by ELatA on 14-2-20.
 */
 var MongoClient = require('mongodb').MongoClient;
 MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
 if(err) { return console.dir(err); }

 var collection = db.collection('test');
 //console.log(collection.find());
 var doc1 = {'hello':'doc1'};
 var doc2 = {'hello':'doc2'};
 var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

 //collection.insert(doc1);

 collection.insert(doc2, {w:1}, function(err, result) {});

 collection.insert(lotsOfDocs, {w:1}, function(err, result) {});
 collection.insert(doc2, {w:1}, function(err, result) {
 collection.update({mykey:2}, {$push:{docs:{doc2:1}}}, {w:1}, function(err, result) {});
 });
 var docs = [{mykey:1}, {mykey:2}, {mykey:3}];
 collection.insert(docs, {w:1}, function(err, result) {

 //collection.remove({mykey:1});

 collection.remove({mykey:2}, {w:1}, function(err, result) {});

 //   collection.remove();
 });
 collection.find().toArray(function(err, items) {
 console.log(items);
 });

 //这个牛逼啊，还带着流
 var stream = collection.find({mykey:{$ne:2}}).stream();
 stream.on("data", function(item) {});
 stream.on("end", function() {});

 collection.findOne({mykey:1}, function(err, item) {});
 });
