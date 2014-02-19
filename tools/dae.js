/**
 * Created by blacksun on 14-2-19.
 */

var fs = require('fs');
var xml2js = require('xml2js');


function parse(xmlString,callback){

}

function read(daeFile,callback){
    var parser = new xml2js.Parser();
    fs.readFile(daeFile, function(err, data) {
        parser.parseString(data, function (err, result) {
            callback(result);
        });
    });
}

exports.readAsJson = read
exports.parseXml = parse