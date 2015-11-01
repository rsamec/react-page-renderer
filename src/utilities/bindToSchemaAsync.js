import traverse from 'traverse';
import _ from 'lodash';
import Q from 'q';
import falcor from 'falcor';
import falcorDataSource from 'falcor-http-datasource';


import pathObjecBinder from './pathObjectBinder';
import {getValueSync, getArrayRange} from './falcorPathUtil.js'
import bindToSchema from './bindToSchema.js';



//Rx.Observable.fromPromiseList = function (promises, errorHandler) {
//    return Rx.Observable.fromArray(promises)
//        .flatMap(function (p) {
//            var o = Rx.Observable.fromPromise(p);
//            if (errorHandler) { o = o.catch(errorHandler); }
//            return o;
//        });
//};

var noop =function(){};

var logError = function(error){console.log(error)};

function bindToSchemaAsync(schema,data){
    const CONTAINER_NAME = "Container";
    const REPEATER_CONTAINER_NAME = "Repeater";
    const BOXES_COLLECTION_NAME = "boxes";

    var deferred = Q.defer();

    var clonedSchema = _.cloneDeep(schema);

    //prepare helper object to grap data binded values -> create data binder
    var dataBinder = new pathObjecBinder(function () {
        return data
    });

    //remote data sources
    var dataSources = _.reduce(schema.props.dataSources, function (memo, value, key) {
        memo[key] = new falcor.Model({source: new falcorDataSource(value)});
        return memo;
    }, {});

    if (dataSources === undefined) {
        deferred.resolve(clonedSchema);
        return deferred.promise;
    }

    var repeaterPromises = [];
    //step -> set repeatable sections (containers) -
    traverse(clonedSchema).forEach(function (x) {
        if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
            var bindingProps = x.props && x.props.binding;

            //apply binding
            //var converter;
            //if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
            //    converter = eval(bindingProps.converter.compiled);
            //}

            var pos = bindingProps.path.indexOf('.');
            if (pos === -1) return;


            //grab model
            var modelPath = bindingProps.path.substr(0, pos);
            if (dataSources[modelPath] === undefined) return;

            //grab path
            var falcorPath = bindingProps.path.substr(pos + 1);

            var rangeFromPath =getArrayRange(falcorPath);
            if (rangeFromPath!== undefined) return;


            repeaterPromises.push(
                dataSources[modelPath].get(falcorPath + '.length').then(function (response) {
                    //console.log("LENGTH set:" + bindingProps.path + " = " + JSON.stringify(response));
                    dataBinder.setValue(bindingProps.path,new Array(getValueSync(response, falcorPath + '.length')));
                    return clonedSchema;
                },logError)
            );
        }
    });

    Q.all(repeaterPromises).then(function() {

        var bindSchema = bindToSchema(clonedSchema, data);

        var promises = [];

        var bindToFalcor = function (props, propName, model, falcorPath, converter) {
            console.log(falcorPath);
            return model.get(falcorPath).then(function (response) {

                var val = getValueSync(response, falcorPath);
                props[propName] = converter !== undefined ? converter.format(val) : val;
                //console.log(val);
                return props[propName];
            },logError);
        }

        traverse(bindSchema).forEach(function (x) {
            if (this.key === BOXES_COLLECTION_NAME) {
                //var parent = this.parent.node;
                for (var i in x) {
                    var box = x[i].props;
                    for (var propName in box) {
                        var bindingProps = box[propName];


                        if (!(_.isObject(bindingProps) && !!bindingProps.path)) continue;

                        //apply binding
                        var converter;
                        if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
                            converter = eval(bindingProps.converter.compiled);
                        }

                        var pos = bindingProps.path.indexOf('.');
                        if (pos === -1) continue;


                        //grab model
                        var modelPath = bindingProps.path.substr(0, pos);
                        if (dataSources[modelPath] === undefined) continue;
                        //grab path
                        var falcorPath = bindingProps.path.substr(pos + 1);
                        promises.push(bindToFalcor(box, propName, dataSources[modelPath], falcorPath, converter));

                    }
                }
            }
        });

        Q.all(promises).then(function(){
            //if (result.state === "fulfilled") {
            //    var value = result.value;
            //} else {
            //    var reason = result.reason;
            //    console.log(reason);
            //}
            deferred.resolve(bindSchema);
        },logError)
    },logError);

    return deferred.promise;
}

export default bindToSchemaAsync;