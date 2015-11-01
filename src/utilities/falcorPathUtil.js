import parser from 'falcor-path-syntax';
import _ from 'lodash';


var getValueArrayPathEx = function(parsedPath){
    var pathIdx = 0;
    var pathLen = parsedPath.length;
    while (++pathIdx < pathLen) {
        if (typeof parsedPath[pathIdx] === "object") {
            return parsedPath.slice(0,pathIdx);
        }
    }
    return undefined;
};
var getValueArrayPath = function(path) {
    var arrayPath = getValueArrayPathEx(parser(path));
    if (arrayPath === undefined) return path;
    return arrayPath.join('.');
};
//var getValueSync = function(model,path){
//    var parsedPath = parser(path);
//    var arrayPath = getValueArrayPathEx(parsedPath);
//    if (arrayPath!== undefined) return _.get(model.getCache(parsedPath),arrayPath);
//    return model._getValueSync(model,parsedPath).value
//};

var getValueSync = function(resp,path){
    if (resp === undefined) return undefined;
    if (resp.json === undefined) return undefined;
    var parsedPath = parser(path);
    var arrayPath = getValueArrayPathEx(parsedPath);
    if (arrayPath!== undefined) return _.get(resp.json,arrayPath);

    return _.get(resp.json,path);
};

var getArrayRange = function(path) {
    var parsedPath = parser(path);
    var pathIdx = 0;
    var pathLen = parsedPath.length;
    while (++pathIdx < pathLen) {
        if (typeof parsedPath[pathIdx] === "object") {
            return parsedPath[pathIdx];
        }
    }
    return undefined;
};

export default {
    getArrayRange:getArrayRange,
    getValueArrayPath:getValueArrayPath,
    getValueSync:getValueSync
}
