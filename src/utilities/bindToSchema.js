import traverse from 'traverse';
import _ from 'lodash';
import pathObjecBinder from './pathObjectBinder';
import {getPathSetRange} from './getPathSetRange.js'

function bindToSchema(schema,data){

    const CONTAINER_NAME = "Container";
    const REPEATER_CONTAINER_NAME = "Repeater";

    //first clone schema
    var clonedSchema = _.cloneDeep(schema);

    //prepare helper object to grap data binded values -> create data binder
    var dataBinder = new pathObjecBinder(function () {
        return data
    });

    var dataSources = dataBinder.getValue("dataSources");
    //if (dataSources == undefined) return;

    var promises = [];

    //step -> set section visibility (containers)
    traverse(clonedSchema).forEach(function (x) {

        if (!!x && x.elementName === CONTAINER_NAME) {

            var visibilityProp = x.props && x.props.visibility;
            //default is visible
            var visibility = true;
            if (!!visibilityProp && !!visibilityProp.path && !dataBinder.getValue(visibilityProp.path)) x.props.visibility = false;
            //traverse(x.props).forEach(function (y) {
            //    //TODO: simple solution for demonstration purposes
            //    if (this.key === "visibility") {
            //        this.update(visibility)
            //    }
            //});

        }
    });

    //step -> set repeatable sections (containers) -
    traverse(clonedSchema).forEach(function (x) {
        if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
            var binding = x.props && x.props.binding;
            var rangeFromPath = !!binding && !!binding.path && getPathSetRange(binding.path);
            if (rangeFromPath === undefined) {
                var dataObj = !!binding && !!binding.path && dataBinder.getValue(binding.path);
                var itemsLength = (!!dataObj && dataObj.length) || 0;
                rangeFromPath = {from:0, to:itemsLength}
            }

            traverse(x.props).forEach(function (y) {
                //TODO: simple solution for demonstration purposes
                if (this.key === "binding") {
                    //y.length =itemsLength;
                    y.range =rangeFromPath;
                }
            });
        }
    });
    return clonedSchema;
}

export default bindToSchema;