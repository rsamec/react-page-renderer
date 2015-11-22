require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilitiesGraphicUtilJs = require('../utilities/graphicUtil.js');

var _utilitiesGraphicUtilJs2 = _interopRequireDefault(_utilitiesGraphicUtilJs);

var _HtmlPagesRendererJs = require('./HtmlPagesRenderer.js');

var _HtmlPagesRendererJs2 = _interopRequireDefault(_HtmlPagesRendererJs);

var HtmlBookRenderer = _react2['default'].createClass({
	displayName: 'HtmlBookRenderer',

	componentDidMount: function componentDidMount() {
		$(this.getDOMNode()).turn({ gradients: false, acceleration: true, autoCenter: true });
	},
	render: function render() {
		var pageSize = _utilitiesGraphicUtilJs2['default'].DefaultPageSizeInPx;
		var bookStyle = { width: pageSize[0] * 2, height: pageSize[1] };
		var cloneProps = _lodash2['default'].extend(this.props, { style: bookStyle });

		return _react2['default'].createElement(_HtmlPagesRendererJs2['default'], cloneProps);
	}
});

module.exports = HtmlBookRenderer;


},{"../utilities/graphicUtil.js":9,"./HtmlPagesRenderer.js":3,"lodash":undefined,"react":undefined}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilitiesGraphicUtilJs = require('../utilities/graphicUtil.js');

var _utilitiesGraphicUtilJs2 = _interopRequireDefault(_utilitiesGraphicUtilJs);

var HtmlPage = _react2['default'].createClass({
	displayName: 'HtmlPage',

	render: function render() {
		//var style = {left:580,position:'absolute'};
		//var component = this.props.errorFlag?React.createElement(this.props.widgets['Shapes.CornerBox'],{text:'', orientation:'topRight',width:70, size:150,style:{}, strokeWidth:1, fill:'darkred'}):React.createElement('span',{});
		var options = this.props.pageOptions;

		var pageSize = _utilitiesGraphicUtilJs2['default'].DefaultPageSize;
		if (options !== undefined && options.height && options.width) {
			pageSize = [options.width, options.height];
		}
		//TODO: implement other sizes
		//else {
		//	paper.format = options.format || 'A4'
		//	paper.orientation = options.orientation || 'portrait'
		//}

		var defaultMargin = _utilitiesGraphicUtilJs2['default'].DefaultMargin;
		var pointToPixel = _utilitiesGraphicUtilJs2['default'].pointToPixel;

		var margins = [defaultMargin, defaultMargin, defaultMargin, defaultMargin];
		if (options !== undefined && options.margin !== undefined) {
			margins = [options.margin.top || defaultMargin, options.margin.right || defaultMargin, options.margin.bottom || defaultMargin, options.margin.left || defaultMargin];
		}

		//convert points to pixel
		pageSize = [pointToPixel(pageSize[0]), pointToPixel(pageSize[1])];
		margins = [pointToPixel(margins[0]), pointToPixel(margins[1]), pointToPixel(margins[2]), pointToPixel(margins[3])];

		//if (this.props.errorFlag) classNames += ' errorFlag';
		var pageInnerStyle = {
			overflow: 'visible',
			width: pageSize[0] - (margins[0] + margins[2]),
			height: pageSize[1] - (margins[1] + margins[3]),
			position: 'relative',
			backgroundColor: 'transparent'
		};
		var pageStyle = {
			width: pageSize[0],
			height: pageSize[1],
			paddingTop: margins[0],
			paddingRight: margins[1],
			paddingBottom: margins[2],
			paddingLeft: margins[3],
			border: options && options.border || 'gray 1px solid',
			backgroundColor: '#ffffff'
		};
		//console.log("InnerStyle: " + JSON.stringify(pageInnerStyle,null,2));
		//console.log("PageStyle: " +  JSON.stringify(pageStyle,null,2));

		return _react2['default'].createElement(
			'div',
			null,
			_react2['default'].createElement(
				'div',
				{ style: pageStyle },
				_react2['default'].createElement(
					'div',
					{ style: pageInnerStyle },
					this.props.children
				)
			)
		);
	}
});

module.exports = HtmlPage;


},{"../utilities/graphicUtil.js":9,"react":undefined}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HtmlPageJs = require('./HtmlPage.js');

var _HtmlPageJs2 = _interopRequireDefault(_HtmlPageJs);

var _utilitiesGraphicUtilJs = require('../utilities/graphicUtil.js');

var _utilitiesGraphicUtilJs2 = _interopRequireDefault(_utilitiesGraphicUtilJs);

var _WidgetRendererJs = require('./WidgetRenderer.js');

var _WidgetRendererJs2 = _interopRequireDefault(_WidgetRendererJs);

var _utilitiesTransformToPages = require('../utilities/transformToPages');

var _utilitiesTransformToPages2 = _interopRequireDefault(_utilitiesTransformToPages);

var HtmlPagesRenderer = _react2['default'].createClass({
	displayName: 'HtmlPagesRenderer',

	render: function render() {
		var pageOptions = this.props.pageOptions || {};
		var pageHeight = pageOptions.height || _utilitiesGraphicUtilJs2['default'].DefaultPageSize[1];
		var pageMargin = pageOptions.margin || {};
		if (pageMargin.top !== undefined) pageHeight -= pageMargin.top;
		if (pageMargin.bottom !== undefined) pageHeight -= pageMargin.bottom;

		var pages = this.props.pages;
		if (pages === undefined) pages = (0, _utilitiesTransformToPages2['default'])(this.props.schema, _utilitiesGraphicUtilJs2['default'].pointToPixel(pageHeight));
		var ctx = this.props.schema.props && this.props.schema.props.context || {};
		var customStyles = ctx['styles'] || {};
		var code = ctx['code'] && ctx['code'].code;
		var customCode = !!code ? new Function(code)() : undefined;

		return _react2['default'].createElement(
			'div',
			{ id: 'section-to-print', style: this.props.style },
			pages.map(function (page, i) {
				return _react2['default'].createElement(
					_HtmlPageJs2['default'],
					{ key: 'page' + i, pageNumber: page.pageNumber, widgets: this.props.widgets,
						errorFlag: this.props.errorFlag, pageOptions: this.props.pageOptions },
					page.boxes.map(function (node, j) {
						var elName = node.element.elementName;
						var widget = _react2['default'].createElement(_WidgetRendererJs2['default'], { key: 'page' + i + '_' + j, widget: this.props.widgets[elName], node: node.element,
							customStyle: customStyles[elName],
							customCode: customCode,
							dataBinder: this.props.dataContext,
							asyncRenderer: this.props.asyncRenderer,
							onFetch: this.props.onFetch });
						return _react2['default'].createElement(
							'div',
							{ style: node.style },
							_react2['default'].createElement(
								'div',
								{ id: node.element.name },
								widget
							)
						);
					}, this)
				);
			}, this)
		);
	}
});

module.exports = HtmlPagesRenderer;


},{"../utilities/graphicUtil.js":9,"../utilities/transformToPages":12,"./HtmlPage.js":2,"./WidgetRenderer.js":4,"react":undefined}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactBinding = require('react-binding');

var _reactBinding2 = _interopRequireDefault(_reactBinding);

var _utilitiesFalcorPathUtilJs = require('../utilities/falcorPathUtil.js');

var WidgetRenderer = _react2['default'].createClass({
	displayName: 'WidgetRenderer',

	mixins: [_reactBinding2['default']],
	getInitialState: function getInitialState() {
		return { changed: false };
	},
	shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
		return true;
		//return this.hasTwoWayBinding();
		//return this.props.node !== nextProps.node ;
	},
	hasBinding: function hasBinding(propName) {
		//TODO: find better way how to detect binding
		var widget = this.props.widget;
		var field = widget.metaData && widget.metaData.settings && widget.metaData.settings.fields && widget.metaData.settings.fields[propName];
		return field !== undefined && (field.type === 'bindingEditor' || field.type === 'bindingValueEditor');
	},
	hasTwoWayBinding: function hasTwoWayBinding() {
		var widget = this.props.widget;
		var box = this.props.node;
		var widgetStyle = _lodash2['default'].cloneDeep(widget.metaData && widget.metaData.props || {});
		var props = _lodash2['default'].merge(widgetStyle, box.props);

		for (var propName in props) {
			var prop = props[propName];
			if (prop === undefined) continue;

			var isBinding = this.hasBinding(propName);
			if (!isBinding) continue;

			if (prop.mode === 'TwoWay') return true;
			//if (prop.mode === undefined){
			//	if ((widget.metaData && widget.metaData.props || {}).mode === 'TwoWay') return true;
			//}
		}
		return false;
	},
	applyBinding: function applyBinding(box, dataBinder, dataSources) {

		var fragments = {};
		//go through all properties
		for (var propName in box) {
			var prop = box[propName];

			var isBinding = this.hasBinding(propName);

			//if binding -> replace binding props
			if (isBinding) {

				if (prop === undefined) continue;

				//bind to const value
				if (prop.value !== undefined) {
					box[propName] = prop.value;
					continue;
				}

				var bindingProps = prop; //field.type === 'bindingEditor'?prop:prop.binding;
				if (_lodash2['default'].isObject(bindingProps) && !!bindingProps.path) {

					//apply binding
					var converter;
					if (!!prop.converter && !!bindingProps.converter.compiled) {
						converter = eval(bindingProps.converter.compiled);
					}
					var binding = this.bindTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs);

					if (dataSources !== undefined) {
						var pos = bindingProps.path.indexOf('.');
						if (pos !== -1) {

							//grab pathes
							var modelPath = bindingProps.path.substr(0, pos);
							var falcorPath = bindingProps.path.substr(pos + 1);

							if (dataSources[modelPath] !== undefined) {
								fragments[propName] = function () {
									return dataSources[modelPath].get(falcorPath).then(function (response) {
										//console.log(response);
										var val = (0, _utilitiesFalcorPathUtilJs.getValueSync)(response, falcorPath);
										return converter !== undefined ? converter.format(val) : val;
									});
								};
								//remove
								delete box[propName];
								continue;
							}
						}
					}

					if (prop.mode === 'TwoWay') {
						//two-way binding
						if (this.props.designer !== true) box.valueLink = this.bindTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs);
						box[propName] = undefined;
					} else {
						//one-way binding
						//box[propName] = dataBinder.value[prop.Path];
						//if (!!dataSources) console.log(dataSources.mfcr && dataSources.mfcr.toJSON());
						box[propName] = binding.value;
					}
				} else {
					//binding is not correctly set - do not apply binding
					//box[propName] = undefined;
				}
			}
		}
		return fragments;
	},
	render: function render() {
		var designer = this.props.designer;

		var asyncRenderer = this.props.asyncRenderer;
		var box = this.props.node;
		var widget = this.props.widget;
		if (widget === undefined) {
			return _react2['default'].DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
		}

		var customStyle = this.props.customStyle;

		//apply property resolution strategy -> default style -> custom style -> local style
		var widgetStyle = _lodash2['default'].cloneDeep(widget.metaData && widget.metaData.props || {});
		if (customStyle !== undefined) widgetStyle = _lodash2['default'].merge(widgetStyle, customStyle);

		var props = _lodash2['default'].merge(widgetStyle, box.props);
		if (this.props.customCode !== undefined) props.customCode = this.props.customCode;

		var fragments;
		if (this.props.dataBinder !== undefined) fragments = this.applyBinding(props, this.props.dataBinder, this.bindTo(this.props.dataBinder, "dataSources").value);

		if (asyncRenderer !== undefined && designer !== true && _lodash2['default'].keys(fragments).length !== 0) widget = asyncRenderer.createContainer(widget, { fragments: fragments });
		return _react2['default'].createElement(widget, props, props.content !== undefined ? _react2['default'].DOM.div({ dangerouslySetInnerHTML: { __html: props.content } }) : null);

		//return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({dangerouslySetInnerHTML: {__html: props.content}}) : null);
	}
});
exports['default'] = WidgetRenderer;

//WidgetRenderer.propTypes = { widget:  React.PropTypes.node, value:React.PropTypes.object,dataBinder:React.PropTypes.object };
module.exports = exports['default'];


},{"../utilities/falcorPathUtil.js":7,"lodash":undefined,"react":undefined,"react-binding":undefined}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pathObjectBinder = require('./pathObjectBinder');

var _pathObjectBinder2 = _interopRequireDefault(_pathObjectBinder);

var _falcorPathUtilJs = require('./falcorPathUtil.js');

function bindToSchema(clonedSchema, data) {

    var CONTAINER_NAME = "Container";
    var REPEATER_CONTAINER_NAME = "Repeater";
    var BOXES_COLLECTION_NAME = "boxes";

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
    var dataBinder = new _pathObjectBinder2['default'](function () {
        return data;
    });

    //step -> set section visibility (containers)
    (0, _traverse2['default'])(clonedSchema).forEach(function (x) {

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
    (0, _traverse2['default'])(clonedSchema).forEach(function (x) {
        if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
            var binding = x.props && x.props.binding;
            var rangeFromPath = !!binding && !!binding.path && (0, _falcorPathUtilJs.getArrayRange)(binding.path);
            if (rangeFromPath === undefined) {
                var dataObj = !!binding && !!binding.path && dataBinder.getValue(binding.path);
                var itemsLength = !!dataObj && dataObj.length || 0;
                rangeFromPath = { from: 0, to: itemsLength };
            }

            (0, _traverse2['default'])(x.props).forEach(function (y) {
                //TODO: simple solution for demonstration purposes
                if (this.key === "binding") {
                    //y.length =itemsLength;
                    y.range = rangeFromPath;
                }
            });
        }
    });
    //TODO: each step means its own recursion - optimize by doing all steps using one recursion

    //step -> remove invisible sections (containers)
    (0, _traverse2['default'])(clonedSchema).forEach(function (x) {

        if (!!x && x.elementName === CONTAINER_NAME) {
            var visibility = x.props && x.props.visibility;
            if (!!visibility) {

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
                this['delete']();
            }
        }
    });

    //step -> process repeatable sections (containers) - for each row - deep clone row template
    (0, _traverse2['default'])(clonedSchema).forEach(function (x) {
        if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
            var binding = x.props && x.props.binding;
            if (!!binding && !!binding.path && !!binding.range) {
                //for each row - deep clone row template
                var clonedRows = [];
                var range = binding.range;
                for (var i = range.from; i != range.to; i++) {

                    var clonedRow = _lodash2['default'].cloneDeep(x);
                    clonedRow.elementName = CONTAINER_NAME;
                    clonedRow.props.binding = undefined;
                    //apply binding using square brackets notation
                    (0, _traverse2['default'])(clonedRow).forEach(function (y) {
                        //TODO: simple solution for demonstration purposes
                        if (this.key === "path") {
                            var lastIndex = binding.path.lastIndexOf('[');

                            var arrayPath = lastIndex !== -1 ? binding.path.substr(0, lastIndex) : binding.path;
                            var rowExpression = arrayPath + "[" + i + "]." + y;

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

exports['default'] = bindToSchema;
module.exports = exports['default'];


},{"./falcorPathUtil.js":7,"./pathObjectBinder":10,"lodash":undefined,"traverse":undefined}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _falcor = require('falcor');

var _falcor2 = _interopRequireDefault(_falcor);

var _falcorHttpDatasource = require('falcor-http-datasource');

var _falcorHttpDatasource2 = _interopRequireDefault(_falcorHttpDatasource);

var _pathObjectBinder = require('./pathObjectBinder');

var _pathObjectBinder2 = _interopRequireDefault(_pathObjectBinder);

var _falcorPathUtilJs = require('./falcorPathUtil.js');

var _bindToSchemaJs = require('./bindToSchema.js');

var _bindToSchemaJs2 = _interopRequireDefault(_bindToSchemaJs);

//Rx.Observable.fromPromiseList = function (promises, errorHandler) {
//    return Rx.Observable.fromArray(promises)
//        .flatMap(function (p) {
//            var o = Rx.Observable.fromPromise(p);
//            if (errorHandler) { o = o.catch(errorHandler); }
//            return o;
//        });
//};

var noop = function noop() {};

var logError = function logError(error) {
    console.log(error);
};

function bindToSchemaAsync(schema, data) {
    var CONTAINER_NAME = "Container";
    var REPEATER_CONTAINER_NAME = "Repeater";
    var BOXES_COLLECTION_NAME = "boxes";

    var deferred = _q2['default'].defer();

    var clonedSchema = _lodash2['default'].cloneDeep(schema);

    //prepare helper object to grap data binded values -> create data binder
    var dataBinder = new _pathObjectBinder2['default'](function () {
        return data;
    });

    //remote data sources
    var dataSources = _lodash2['default'].reduce(schema.props.dataSources, function (memo, value, key) {
        memo[key] = new _falcor2['default'].Model({ source: new _falcorHttpDatasource2['default'](value) });
        return memo;
    }, {});

    if (dataSources === undefined) {
        deferred.resolve(clonedSchema);
        return deferred.promise;
    }

    var repeaterPromises = [];
    //step -> set repeatable sections (containers) -
    (0, _traverse2['default'])(clonedSchema).forEach(function (x) {
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

            var rangeFromPath = (0, _falcorPathUtilJs.getArrayRange)(falcorPath);
            if (rangeFromPath !== undefined) return;

            repeaterPromises.push(dataSources[modelPath].get(falcorPath + '.length').then(function (response) {
                //console.log("LENGTH set:" + bindingProps.path + " = " + JSON.stringify(response));
                dataBinder.setValue(bindingProps.path, new Array((0, _falcorPathUtilJs.getValueSync)(response, falcorPath + '.length')));
                return clonedSchema;
            }, logError));
        }
    });

    _q2['default'].all(repeaterPromises).then(function () {

        var bindSchema = (0, _bindToSchemaJs2['default'])(clonedSchema, data);

        var promises = [];

        var bindToFalcor = function bindToFalcor(props, propName, model, falcorPath, converter) {
            console.log(falcorPath);
            return model.get(falcorPath).then(function (response) {

                var val = (0, _falcorPathUtilJs.getValueSync)(response, falcorPath);
                props[propName] = converter !== undefined ? converter.format(val) : val;
                //console.log(val);
                return props[propName];
            }, logError);
        };

        (0, _traverse2['default'])(bindSchema).forEach(function (x) {
            if (this.key === BOXES_COLLECTION_NAME) {
                //var parent = this.parent.node;
                for (var i in x) {
                    var box = x[i].props;
                    for (var propName in box) {
                        var bindingProps = box[propName];

                        if (!(_lodash2['default'].isObject(bindingProps) && !!bindingProps.path)) continue;

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

        _q2['default'].all(promises).then(function () {
            //if (result.state === "fulfilled") {
            //    var value = result.value;
            //} else {
            //    var reason = result.reason;
            //    console.log(reason);
            //}
            deferred.resolve(bindSchema);
        }, logError);
    }, logError);

    return deferred.promise;
}

exports['default'] = bindToSchemaAsync;
module.exports = exports['default'];


},{"./bindToSchema.js":5,"./falcorPathUtil.js":7,"./pathObjectBinder":10,"falcor":undefined,"falcor-http-datasource":undefined,"lodash":undefined,"q":undefined,"traverse":undefined}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _falcorPathSyntax = require('falcor-path-syntax');

var _falcorPathSyntax2 = _interopRequireDefault(_falcorPathSyntax);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var getValueArrayPathEx = function getValueArrayPathEx(parsedPath) {
    var pathIdx = 0;
    var pathLen = parsedPath.length;
    while (++pathIdx < pathLen) {
        if (typeof parsedPath[pathIdx] === "object") {
            return parsedPath.slice(0, pathIdx);
        }
    }
    return undefined;
};
var getValueArrayPath = function getValueArrayPath(path) {
    var arrayPath = getValueArrayPathEx((0, _falcorPathSyntax2['default'])(path));
    if (arrayPath === undefined) return path;
    return arrayPath.join('.');
};
//var getValueSync = function(model,path){
//    var parsedPath = parser(path);
//    var arrayPath = getValueArrayPathEx(parsedPath);
//    if (arrayPath!== undefined) return _.get(model.getCache(parsedPath),arrayPath);
//    return model._getValueSync(model,parsedPath).value
//};

var getValueSync = function getValueSync(resp, path) {
    if (resp === undefined) return undefined;
    if (resp.json === undefined) return undefined;
    var parsedPath = (0, _falcorPathSyntax2['default'])(path);
    var arrayPath = getValueArrayPathEx(parsedPath);
    if (arrayPath !== undefined) return _lodash2['default'].get(resp.json, arrayPath);

    return _lodash2['default'].get(resp.json, path);
};

var getArrayRange = function getArrayRange(path) {
    var parsedPath = (0, _falcorPathSyntax2['default'])(path);
    var pathIdx = 0;
    var pathLen = parsedPath.length;
    while (++pathIdx < pathLen) {
        if (typeof parsedPath[pathIdx] === "object") {
            return parsedPath[pathIdx];
        }
    }
    return undefined;
};

exports['default'] = {
    getArrayRange: getArrayRange,
    getValueArrayPath: getValueArrayPath,
    getValueSync: getValueSync
};
module.exports = exports['default'];


},{"falcor-path-syntax":undefined,"lodash":undefined}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _transformToPagesJs = require('./transformToPages.js');

var _transformToPagesJs2 = _interopRequireDefault(_transformToPagesJs);

var _graphicUtilJs = require('./graphicUtil.js');

var _graphicUtilJs2 = _interopRequireDefault(_graphicUtilJs);

exports['default'] = function (schema, pageOptions) {
    var pageOptions = pageOptions || {};
    var pageHeight = pageOptions.height || _graphicUtilJs2['default'].DefaultPageSize[1];
    var pageMargin = pageOptions.margin || {};
    if (pageMargin.top !== undefined) pageHeight -= pageMargin.top;
    if (pageMargin.bottom !== undefined) pageHeight -= pageMargin.bottom;

    return (0, _transformToPagesJs2['default'])(schema, _graphicUtilJs2['default'].pointToPixel(pageHeight));
};

module.exports = exports['default'];


},{"./graphicUtil.js":9,"./transformToPages.js":12}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _standardPageSizes = require('./standardPageSizes');

var _standardPageSizes2 = _interopRequireDefault(_standardPageSizes);

var GraphicPrimitive = (function () {
	function GraphicPrimitive() {
		_classCallCheck(this, GraphicPrimitive);
	}

	_createClass(GraphicPrimitive, null, [{
		key: 'pointToPixel',
		value: function pointToPixel(point) {
			if (point === undefined) return;
			var convertedPoint = point / 72 * GraphicPrimitive.DPI;
			return convertedPoint.toFixed(3);
		}
	}, {
		key: 'DPI',
		get: function get() {
			return 96;
		}
	}, {
		key: 'DefaultMargin',

		//default margin for A4 format
		get: function get() {
			return 21.6;
		}

		//get page size for A4 format in points
	}, {
		key: 'DefaultPageSize',
		get: function get() {
			return [_standardPageSizes2['default'].A4[0], _standardPageSizes2['default'].A4[1]];
		}

		//get page size for A4 format in pixels
	}, {
		key: 'DefaultPageSizeInPx',
		get: function get() {
			return [GraphicPrimitive.pointToPixel(_standardPageSizes2['default'].A4[0]), GraphicPrimitive.pointToPixel(_standardPageSizes2['default'].A4[1])];
		}
	}, {
		key: 'PageSizes',
		get: function get() {
			return _standardPageSizes2['default'];
		}
	}]);

	return GraphicPrimitive;
})();

;

exports['default'] = GraphicPrimitive;
module.exports = exports['default'];


},{"./standardPageSizes":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var pathObjectBinder = (function () {
    function pathObjectBinder(sourceGetter) {
        this.sourceGetter = sourceGetter;
    }
    pathObjectBinder.prototype.getValue = function (path) {
        if (path === undefined) return this.sourceGetter();
        var parent = this.getParent(path);
        if (parent === undefined) return;
        var property = this.getProperty(path);
        return parent[property];
    };
    pathObjectBinder.prototype.setValue = function (path, value) {
        var parent = this.getParent(path);
        if (parent === undefined) return;
        var property = this.getProperty(path);
        parent[property] = value;
    };
    pathObjectBinder.prototype.getParent = function (path) {
        var last = path.lastIndexOf(".");
        var obj = this.sourceGetter();
        return last != -1 ? this.string_to_ref(obj, path.substring(0, last)) : obj;
    };
    pathObjectBinder.prototype.getProperty = function (path) {
        var last = path.lastIndexOf(".");
        return last != -1 ? path.substring(last + 1, path.length) : path;
    };
    pathObjectBinder.prototype.string_to_ref = function (obj, string) {
        if (obj === undefined) return undefined;
        var parts = string.split('.');

        //find square brackets (array-syntax]
        var arrayExp = /\[(\d*)\]/;
        var firstExp = parts[0];
        var matches = arrayExp.exec(firstExp);

        //try find existing instance
        var newObj = !!matches ? obj[firstExp.replace(matches[0], "")][matches[1]] : obj[firstExp];

        //if no object found - initialize new objects -
        if (newObj === undefined) newObj = obj[parts[0]] = {};

        if (!parts[1]) {
            return newObj;
        }
        parts.splice(0, 1);
        var newString = parts.join('.');
        return this.string_to_ref(newObj, newString);
    };
    return pathObjectBinder;
})();
exports["default"] = pathObjectBinder;
module.exports = exports["default"];


},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = {
	A0: [2383.94, 3370.39],
	A1: [1683.78, 2383.94],
	A2: [1190.55, 1683.78],
	A3: [841.89, 1190.55],
	A4: [595.28, 841.89],
	A5: [419.53, 595.28],
	A6: [297.64, 419.53],
	A7: [209.76, 297.64],
	A8: [147.40, 209.76],
	A9: [104.88, 147.40],
	A10: [73.70, 104.88],
	B0: [2834.65, 4008.19],
	B1: [2004.09, 2834.65],
	B2: [1417.32, 2004.09],
	B3: [1000.63, 1417.32],
	B4: [708.66, 1000.63],
	B5: [498.90, 708.66],
	B6: [354.33, 498.90],
	B7: [249.45, 354.33],
	B8: [175.75, 249.45],
	B9: [124.72, 175.75],
	B10: [87.87, 124.72],
	C0: [2599.37, 3676.54],
	C1: [1836.85, 2599.37],
	C2: [1298.27, 1836.85],
	C3: [918.43, 1298.27],
	C4: [649.13, 918.43],
	C5: [459.21, 649.13],
	C6: [323.15, 459.21],
	C7: [229.61, 323.15],
	C8: [161.57, 229.61],
	C9: [113.39, 161.57],
	C10: [79.37, 113.39],
	RA0: [2437.80, 3458.27],
	RA1: [1729.13, 2437.80],
	RA2: [1218.90, 1729.13],
	RA3: [864.57, 1218.90],
	RA4: [609.45, 864.57],
	SRA0: [2551.18, 3628.35],
	SRA1: [1814.17, 2551.18],
	SRA2: [1275.59, 1814.17],
	SRA3: [907.09, 1275.59],
	SRA4: [637.80, 907.09],
	EXECUTIVE: [521.86, 756.00],
	FOLIO: [612.00, 936.00],
	LEGAL: [612.00, 1008.00],
	LETTER: [612.00, 792.00],
	TABLOID: [792.00, 1224.00]
};
module.exports = exports["default"];


},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * This reduce containers objects (containers, repeaters) to boxes group by pages.
 * This reduce object schema tree to flat boxes group by pages.
 * The transformation has these steps
 * -    transform relative positions to absolute positions (top, left)
 * -    removes all content in hidden containers
 * -    expands repeatable container (using repeater binding)
 * -    group to pages
 * -    apply one-way data binding
 *
 * @param {object} schema - object schema tree
 * @param {object} data - data context used for data binding
 * @returns {object} schema to render -> pages with boxes with data-binded values
 */
var generateCssTransform = function generateCssTransform(transform) {
    var cssTransform = '';

    if (transform.tx !== undefined) cssTransform += ' translateX(' + transform.tx + 'px)';
    if (transform.ty !== undefined) cssTransform += ' translateY(' + transform.ty + 'px)';
    if (transform.rz !== undefined) cssTransform += ' rotate(' + transform.rz + 'rad)';
    if (transform.sx !== undefined) cssTransform += ' scaleX(' + transform.sx + ')';
    if (transform.sy !== undefined) cssTransform += ' scaleY(' + transform.sy + ')';

    return cssTransform;
};
function transformToPages(clonedSchema, pageHeight) {

    var CONTAINER_NAME = "Container";
    var REPEATER_CONTAINER_NAME = "Repeater";
    var BOXES_COLLECTION_NAME = "boxes";
    var DEFAULT_PAGE_HEIGHT = 1065;

    //step -> transform relative positions to absolute positions
    if (pageHeight === undefined) pageHeight = DEFAULT_PAGE_HEIGHT;
    var globalTop = 0;
    var trav = function trav(node) {

        var props = node.props;
        if (node === undefined) return 0;

        //grap height and top properties
        var nodeHeight = node.style === undefined ? 0 : parseInt(node.style.height, 10);
        if (isNaN(nodeHeight)) nodeHeight = 0;
        var nodeTop = node.style === undefined ? 0 : parseInt(node.style.top, 10);
        if (isNaN(nodeTop)) nodeTop = 0;

        var children = node.containers;
        var computedHeight = 0;
        if (children === undefined) return computedHeight;
        var childrenHeight = 0;

        //unbreakable -> if section is too height to have enough place to fit the the page - move it to the next page
        var startOnNewPage = false;
        if (!!props.unbreakable) {
            var nodeBottom = globalTop + nodeHeight;
            var nextPageTop = Math.ceil(globalTop / pageHeight) * pageHeight;
            startOnNewPage = nodeBottom > nextPageTop;
        }

        //startOnNewPage - move globalTop to the next page
        if (!!props.startOnNewPage || startOnNewPage) globalTop = Math.ceil(globalTop / pageHeight) * pageHeight;

        //set absolute top property - use last global top + node top (container can have top != 0)
        if (node.style !== undefined) node.style.top = globalTop + nodeTop;

        //recurse by all its children containers
        for (var i in children) {
            childrenHeight += trav(children[i]);
        }

        //expand container height if childrenHeight is greater than node height - typically for repeated containers
        computedHeight = _lodash2['default'].max([nodeHeight, childrenHeight]) + nodeTop;
        //var tmp =  node.style!==undefined?node.style.top:'--';
        //console.log(node.name + ":" + height + "->" + top + ", " + tmp);

        //compute next top
        globalTop += computedHeight - childrenHeight;
        //return computed height of container
        return computedHeight;
    };
    trav(clonedSchema);

    //step -> reduce to boxes - using containers absolute positions (top,height) and its dimensions (with, height)
    //step -> create pages and add boxes to them
    var pages = [];
    var currentPage;
    (0, _traverse2['default'])(clonedSchema).reduce(function (occ, x) {

        if (this.key === BOXES_COLLECTION_NAME) {
            var parent = this.parent.node;
            for (var i in x) {
                var el = x[i];

                var elTop = el.style.top && parseInt(el.style.top, 10) || 0;
                var elLeft = el.style.left && parseInt(el.style.left, 10) || 0;

                //grab parent positions
                var top = parseInt(parent.style.top, 10) + elTop;
                var left = parseInt(parent.style.left, 10) + elLeft;

                //grab parent dimensions
                //TODO: !!!! temporarily - container width simulates boxes width
                var height = parseInt(parent.style.height, 10) - elTop;
                var width = parseInt(parent.style.width, 10) - elLeft;
                //var height = parseInt(el.style.height,10);
                //var width = parseInt(el.style.width,10);
                if (isNaN(height)) height = 0;
                if (isNaN(width)) width = 0;

                //create newPage
                if (currentPage === undefined || top + height > pageHeight * pages.length) {
                    var newPage = { pageNumber: pages.length + 1, boxes: [] };
                    pages.push(newPage);
                    currentPage = newPage;
                }

                //decrease top according the pages
                if (pages.length > 1) {
                    top -= (pages.length - 1) * pageHeight;
                };

                var style = { 'left': left, 'top': top, 'position': 'absolute' };
                if (el.style.width !== undefined) style.width = el.style.width;
                if (el.style.height !== undefined) style.height = el.style.height;
                if (el.style.zIndex !== undefined) style.zIndex = el.style.zIndex;

                //propagate width and height to widget props
                if (!el.props.width && !!el.style.width) el.props.width = el.style.width;
                if (!el.props.height && !!el.style.height) el.props.height = el.style.height;

                if (el.style.transform !== undefined) {
                    style.WebkitTransform = generateCssTransform(el.style.transform);
                    style.transform = generateCssTransform(el.style.transform);
                }
                // set another box
                currentPage.boxes.push({ element: x[i], style: style });
            }
        }
        return occ;
    }, pages);

    //step -> apply one-way binding
    //_.each(pages,function(page){
    //    _.each(page.boxes,function(node) {
    //        var box = node.element;
    //        for (var propName in box){
    //            var prop = box[propName];
    //            //TODO: better test - it is a binding object?
    //            if (_.isObject(prop) && !!prop.Path && prop.Mode !== 'TwoWay'){
    //                //one-way binding
    //                box[propName] = dataBinder.getValue(prop.Path);
    //            }
    //        }
    //    })
    //});

    return pages;
};

exports['default'] = transformToPages;
module.exports = exports['default'];


},{"lodash":undefined,"traverse":undefined}],"react-page-renderer":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var HtmlPagesRenderer = require('./components/HtmlPagesRenderer');
var HtmlBookRenderer = require('./components/HtmlBookRenderer');
var WidgetRenderer = require('./components/WidgetRenderer');
var GraphicUtil = require('./utilities/graphicUtil');
var BindingUtil = {
	bindToSchema: require('./utilities/bindToSchema'),
	bindToSchemaAsync: require('./utilities/bindToSchemaAsync'),
	getPages: require('./utilities/getPages')
};

exports['default'] = {
	HtmlPagesRenderer: HtmlPagesRenderer,
	HtmlBookRenderer: HtmlBookRenderer,
	GraphicUtil: GraphicUtil,
	BindingUtil: BindingUtil,
	WidgetRenderer: WidgetRenderer
};
module.exports = exports['default'];


},{"./components/HtmlBookRenderer":1,"./components/HtmlPagesRenderer":3,"./components/WidgetRenderer":4,"./utilities/bindToSchema":5,"./utilities/bindToSchemaAsync":6,"./utilities/getPages":8,"./utilities/graphicUtil":9}]},{},[]);
