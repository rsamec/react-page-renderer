import traverse from 'traverse';
import _ from 'lodash';
import pathObjecBinder from './pathObjectBinder';
import {getArrayRange,getValueArrayPath} from './falcorPathUtil.js'


function bindToSchema(clonedSchema,data){

    const CONTAINER_NAME = "Container";
    const REPEATER_CONTAINER_NAME = "Repeater";
    const BOXES_COLLECTION_NAME = "boxes";

    //var specialClone = function(current, containers){ return _.extend(_.cloneDeep(_.omit(current,['containers','boxes'])),{containers:containers, boxes:current.boxes})}
    ////first clone schema so that
    //// deep clone for containers
    //// shallow clone for boxes
    //function iterate(current) {
    //    var children = current.containers;
    //
    //    //stop condition
    //    if (children === undefined || children.length === 0){
    //        return specialClone(current,[]);
    //    };
    //
    //    //iterate through containers
    //    var containers = [];
    //    for (var i = 0, len = children.length; i < len; i++) {
    //        containers.push(iterate(children[i]));
    //    }
    //    return specialClone(current,containers);
    //}

    //prepare helper object to grap data binded values -> create data binder
    var dataBinder = new pathObjecBinder(function () {
        return data
    });

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
            var rangeFromPath = !!binding && !!binding.path && getArrayRange(binding.path);
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
    //TODO: each step means its own recursion - optimize by doing all steps using one recursion

    //step -> remove invisible sections (containers)
    traverse(clonedSchema).forEach(function (x) {

        if (!!x && x.elementName === CONTAINER_NAME) {
            var visibility = x.props && x.props.visibility;
            if (!!visibility){

                //get parent
                var parent = this.parent;
                if (parent !== undefined) parent = parent.parent;
                if (parent !== undefined) parent = parent.node;

                //decrese the height of the parent container
                if (parent !== undefined && parent.style !== undefined) {
                    var parentHeight = parseInt(parent.style.height, 10);
                    var nodeHeight = parseInt(x.style.height, 10);
                    if (!isNaN(nodeHeight) && !isNaN(parentHeight)) parent.style.height = parentHeight - nodeHeight;
                }

                //invisible section -> delete
                this.delete();
            }
        }
    });

    //step -> process repeatable sections (containers) - for each row - deep clone row template
    traverse(clonedSchema).forEach(function (x) {
        if (!!x && x.elementName === REPEATER_CONTAINER_NAME){
            var binding = x.props && x.props.binding;
            if(!!binding && !!binding.path && !!binding.range) {
                //for each row - deep clone row template
                var clonedRows = [];
                var range = binding.range;
                for (var i = range.from; i != range.to; i++) {

                    var clonedRow = _.cloneDeep(x);
                    clonedRow.elementName = CONTAINER_NAME;
                    clonedRow.props.binding = undefined;
                    //apply binding using square brackets notation
                    traverse(clonedRow).forEach(function (y) {
                        //TODO: simple solution for demonstration purposes
                        if (this.key === "path") {
                            var rowExpression = getValueArrayPath(binding.path) + "[" + i + "]." + y;
                            this.update(rowExpression);
                        }
                    });

                    clonedRows.push(clonedRow);
                }

                //assign all cloned rows to parent section
                x.containers = clonedRows;
                x.boxes = [];

            }
        }
    });
    return clonedSchema;
}

export default bindToSchema;