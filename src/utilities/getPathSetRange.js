import parser from 'falcor-path-syntax';
import _ from 'lodash';

var getPathSetRange = function(falcorPath) {
    var parsedPath = parser(falcorPath);
    var lastToken = parsedPath[parsedPath.length - 1];
    if (!_.isString(lastToken)) return lastToken;
    return undefined;
};
var normalizePathByRemovePathSet = function(falcorPath){
    var parsedPath = parser(falcorPath);
    var lastToken = parsedPath[parsedPath.length - 1];
    if (_.isString(lastToken)) return falcorPath;
    return parsedPath.slice(0,parsedPath.length - 1).join('.');
}
export default {
    getPathSetRange:getPathSetRange,
    normalizePathByRemovePathSet: normalizePathByRemovePathSet
}
