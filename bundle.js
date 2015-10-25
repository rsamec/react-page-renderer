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


},{"../utilities/graphicUtil.js":7,"./HtmlPagesRenderer.js":3,"lodash":undefined,"react":undefined}],2:[function(require,module,exports){
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


},{"../utilities/graphicUtil.js":7,"react":undefined}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactBinding = require('react-binding');

var _reactBinding2 = _interopRequireDefault(_reactBinding);

var _HtmlPageJs = require('./HtmlPage.js');

var _HtmlPageJs2 = _interopRequireDefault(_HtmlPageJs);

var _WidgetRendererJs = require('./WidgetRenderer.js');

var _WidgetRendererJs2 = _interopRequireDefault(_WidgetRendererJs);

var _utilitiesBindToSchemaJs = require('../utilities/bindToSchema.js');

var _utilitiesBindToSchemaJs2 = _interopRequireDefault(_utilitiesBindToSchemaJs);

var _utilitiesTransformToPages = require('../utilities/transformToPages');

var _utilitiesTransformToPages2 = _interopRequireDefault(_utilitiesTransformToPages);

var _utilitiesStandardPageSizes = require('./../utilities/standardPageSizes');

var _utilitiesStandardPageSizes2 = _interopRequireDefault(_utilitiesStandardPageSizes);

var _utilitiesGetPathSetRangeJs = require('./../utilities/getPathSetRange.js');

var _falcorPathSyntax = require('falcor-path-syntax');

var _falcorPathSyntax2 = _interopRequireDefault(_falcorPathSyntax);

var HtmlPagesRenderer = _react2['default'].createClass({
	displayName: 'HtmlPagesRenderer',

	mixins: [_reactBinding2['default']],
	//createComponent: function (box) {
	//	var widget = this.props.widgets[box.elementName];
	//	if (widget === undefined) return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
	//
	//	//optionally add internatialization data
	//	if (this.props.intlData !== undefined) box = _.extend(box,box.locales !==undefined?_.omit(this.props.intlData,'locales'):this.props.intlData);
	//	
	//	
	//	//optionally add binding
	//	if (this.props.dataContext !== undefined) this.applyBinding(box,this.props.dataContext);
	//	
	//	//render
	//	return React.createElement(widget, box, box.content !== undefined ? React.DOM.span(null, box.content) : undefined);
	//},
	//shouldComponentUpdate(nextProps){
	//	return this.props.node !== nextProps.node;
	//},
	componentDidMount: function componentDidMount() {

		var CONTAINER_NAME = "Container";
		var REPEATER_CONTAINER_NAME = "Repeater";

		var dataBinder = this.props.dataContext;
		if (dataBinder === undefined) return;
		var dataSources = this.bindTo(dataBinder, "dataSources").value;
		if (dataSources == undefined) return;

		var self = this;

		//step -> set repeatable sections (containers) -
		(0, _traverse2['default'])(this.props.schema).forEach(function (x) {
			if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
				var bindingProps = x.props && x.props.binding;

				var binding = self.bindTo(dataBinder, bindingProps.path);

				var pos = bindingProps.path.indexOf('.');
				if (pos === -1) return;

				//grab pathes
				var modelPath = bindingProps.path.substr(0, pos);
				var falcorPath = bindingProps.path.substr(pos + 1);

				if (dataSources[modelPath] === undefined) return;
				var parsedPath = (0, _falcorPathSyntax2['default'])(falcorPath);
				var rangeFromPath = (0, _utilitiesGetPathSetRangeJs.getPathSetRange)(falcorPath);
				if (rangeFromPath === undefined) {
					dataSources[modelPath].get(falcorPath + '.length').then(function (response) {
						if (response === undefined) return;
						console.log(binding.path);
						console.log(response.json);
						binding.value = new Array(_lodash2['default'].get(response.json, falcorPath).length);
					});
				}
			}
		});
	},
	render: function render() {
		var pages = (0, _utilitiesTransformToPages2['default'])((0, _utilitiesBindToSchemaJs2['default'])(this.props.schema, this.props.data));
		var ctx = this.props.schema.props && this.props.schema.props.context || {};
		var customStyles = ctx['styles'] || {};
		return _react2['default'].createElement(
			'div',
			{ id: 'section-to-print', style: this.props.style },
			pages.map(function (page, i) {
				return _react2['default'].createElement(
					_HtmlPageJs2['default'],
					{ pageNumber: page.pageNumber, widgets: this.props.widgets, errorFlag: this.props.errorFlag, pageOptions: this.props.pageOptions },
					page.boxes.map(function (node, i) {
						var elName = node.element.elementName;
						var widget = _react2['default'].createElement(_WidgetRendererJs2['default'], { widget: this.props.widgets[elName], node: node.element, customStyle: customStyles[elName], dataBinder: this.props.dataContext });
						return _react2['default'].createElement(
							'div',
							{ style: node.style },
							widget
						);
					}, this)
				);
			}, this)
		);
	}
});

module.exports = HtmlPagesRenderer;


},{"../utilities/bindToSchema.js":5,"../utilities/transformToPages":10,"./../utilities/getPathSetRange.js":6,"./../utilities/standardPageSizes":9,"./HtmlPage.js":2,"./WidgetRenderer.js":4,"falcor-path-syntax":undefined,"lodash":undefined,"react":undefined,"react-binding":undefined,"traverse":undefined}],4:[function(require,module,exports){
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

var _reactTransmit = require('react-transmit');

var _reactTransmit2 = _interopRequireDefault(_reactTransmit);

var WidgetRenderer = _react2['default'].createClass({
	displayName: 'WidgetRenderer',

	mixins: [_reactBinding2['default']],
	shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
		return this.props.node !== nextProps.node;
	},
	//componentDidMount(){
	//	var box = this.props.node;
	//	var dataBinder = this.props.dataBinder;
	//	if (dataBinder === undefined) return;
	//	var dataSources = this.bindTo(this.props.dataBinder, "dataSources").value;
	//	if (dataSources == undefined) return;
	//
	//	for (var propName in box.props) {
	//		var bindingProps = box.props[propName];
	//
	//		if (!(_.isObject(bindingProps) && !!bindingProps.path)) continue;
	//
	//
	//		//apply binding
	//		//var converter;
	//		//if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
	//		//	converter = eval(bindingProps.converter.compiled);
	//		//}
	//		var binding = this.bindTo(dataBinder, bindingProps.path);
	//
	//
	//		var pos = bindingProps.path.indexOf('.');
	//		if (pos === -1) continue;
	//
	//		//grab pathes
	//		var modelPath = bindingProps.path.substr(0, pos);
	//		var falcorPath = bindingProps.path.substr(pos + 1);
	//
	//		if (dataSources[modelPath] === undefined) continue;
	//
	//	   	dataSources[modelPath].get(falcorPath).then(function(response){
	//			var pathSet =falcorPath.indexOf('..') !== -1;
	//			if (pathSet) {
	//				console.log(binding.path);
	//				console.log(response.json);
	//			}
	//			var val = _.get(response.json,pathSet?falcorPath.substr(0,falcorPath.indexOf('[')):falcorPath);
	//			binding.value =val;//converter!==undefined? converter.format(val):val;
	//		});
	//	}
	//
	//},
	hasBinding: function hasBinding(propName) {
		//TODO: find better way how to detect binding
		var widget = this.props.widget;
		var field = widget.metaData && widget.metaData.settings && widget.metaData.settings.fields && widget.metaData.settings.fields[propName];
		return field !== undefined && (field.type === 'bindingEditor' || field.type === 'bindingValueEditor');
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
					var binding = this.bindTo(dataBinder, bindingProps.path, converter);

					if (dataSources !== undefined) {
						var pos = bindingProps.path.indexOf('.');
						if (pos !== -1) {

							//grab pathes
							var modelPath = bindingProps.path.substr(0, pos);
							var falcorPath = bindingProps.path.substr(pos + 1);

							if (dataSources[modelPath] !== undefined) {
								fragments[propName] = function () {
									return dataSources[modelPath].get(falcorPath).then(function (response) {
										var pathSet = falcorPath.indexOf('..') !== -1;
										var val = _lodash2['default'].get(response.json, pathSet ? falcorPath.substr(0, falcorPath.indexOf('[')) : falcorPath);
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
						if (this.props.designer !== true) box.valueLink = this.bindTo(dataBinder, bindingProps.path, converter);
						box[propName] = undefined;
					} else {
						//one-way binding
						//box[propName] = dataBinder.value[prop.Path];
						//if (!!dataSources) console.log(dataSources.mfcr && dataSources.mfcr.toJSON());
						box[propName] = binding.value;
					}
				} else {
					//binding is not correctly set - do not apply binding
					box[propName] = undefined;
				}
			}
		}
		return fragments;
	},
	render: function render() {
		var designer = this.props.designer;

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

		var fragments;
		if (this.props.dataBinder !== undefined) fragments = this.applyBinding(props, this.props.dataBinder, this.bindTo(this.props.dataBinder, "dataSources").value);

		if (designer !== true && _lodash2['default'].keys(fragments).length !== 0) widget = _reactTransmit2['default'].createContainer(widget, { fragments: fragments });
		return _react2['default'].createElement(widget, props, props.content !== undefined ? _react2['default'].DOM.div({ dangerouslySetInnerHTML: { __html: props.content } }) : null);

		//return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({dangerouslySetInnerHTML: {__html: props.content}}) : null);
	}
});
exports['default'] = WidgetRenderer;

//WidgetRenderer.propTypes = { widget:  React.PropTypes.node, value:React.PropTypes.object,dataBinder:React.PropTypes.object };
module.exports = exports['default'];


},{"lodash":undefined,"react":undefined,"react-binding":undefined,"react-transmit":undefined}],5:[function(require,module,exports){
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

var _getPathSetRangeJs = require('./getPathSetRange.js');

function bindToSchema(schema, data) {

    var CONTAINER_NAME = "Container";
    var REPEATER_CONTAINER_NAME = "Repeater";

    //first clone schema
    var clonedSchema = _lodash2['default'].cloneDeep(schema);

    //prepare helper object to grap data binded values -> create data binder
    var dataBinder = new _pathObjectBinder2['default'](function () {
        return data;
    });

    var dataSources = dataBinder.getValue("dataSources");
    //if (dataSources == undefined) return;

    var promises = [];

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
            var rangeFromPath = !!binding && !!binding.path && (0, _getPathSetRangeJs.getPathSetRange)(binding.path);
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
    return clonedSchema;
}

exports['default'] = bindToSchema;
module.exports = exports['default'];


},{"./getPathSetRange.js":6,"./pathObjectBinder":8,"lodash":undefined,"traverse":undefined}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _falcorPathSyntax = require('falcor-path-syntax');

var _falcorPathSyntax2 = _interopRequireDefault(_falcorPathSyntax);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var getPathSetRange = function getPathSetRange(falcorPath) {
    var parsedPath = (0, _falcorPathSyntax2['default'])(falcorPath);
    var lastToken = parsedPath[parsedPath.length - 1];
    if (!_lodash2['default'].isString(lastToken)) return lastToken;
    return undefined;
};
var normalizePathByRemovePathSet = function normalizePathByRemovePathSet(falcorPath) {
    var parsedPath = (0, _falcorPathSyntax2['default'])(falcorPath);
    var lastToken = parsedPath[parsedPath.length - 1];
    if (_lodash2['default'].isString(lastToken)) return falcorPath;
    return parsedPath.slice(0, parsedPath.length - 1).join('.');
};
exports['default'] = {
    getPathSetRange: getPathSetRange,
    normalizePathByRemovePathSet: normalizePathByRemovePathSet
};
module.exports = exports['default'];


},{"falcor-path-syntax":undefined,"lodash":undefined}],7:[function(require,module,exports){
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
			return point / 72 * GraphicPrimitive.DPI;
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
	}]);

	return GraphicPrimitive;
})();

;

exports['default'] = GraphicPrimitive;
module.exports = exports['default'];


},{"./standardPageSizes":9}],8:[function(require,module,exports){
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


},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = {
	A4: [595.28, 841.89],
	LETTER: [612.00, 792.00],
	TABLOID: [792.00, 1224.00]
};
module.exports = exports["default"];


},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _getPathSetRangeJs = require('./getPathSetRange.js');

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
    if (transform.sy !== undefined) cssTransform += ' scaleY(' + transform.sy + ')';;

    return cssTransform;
};
function transformToPages(clonedSchema) {

    var CONTAINER_NAME = "Container";
    var REPEATER_CONTAINER_NAME = "Repeater";
    var BOXES_COLLECTION_NAME = "boxes";

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
                    //apply binding using square brackets notation
                    (0, _traverse2['default'])(clonedRow).forEach(function (y) {
                        //TODO: simple solution for demonstration purposes
                        if (this.key === "path") {
                            var rowExpression = (0, _getPathSetRangeJs.normalizePathByRemovePathSet)(binding.path) + "[" + i + "]." + y;
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

    //step -> transform relative positions to absolute positions
    var pageHeight = 1065;
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

                var style = { 'left': left, 'top': top, 'height': height, 'width': width, 'position': 'absolute' };
                if (el.style.width !== undefined) style.width = el.style.width;
                if (el.style.height !== undefined) style.height = el.style.height;

                if (el.style.transform !== undefined) {
                    style.webkitTransform = generateCssTransform(el.style.transform);
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


},{"./getPathSetRange.js":6,"lodash":undefined,"traverse":undefined}],"react-page-renderer":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var HtmlPagesRenderer = require('./components/HtmlPagesRenderer');
var HtmlBookRenderer = require('./components/HtmlBookRenderer');
var WidgetRenderer = require('./components/WidgetRenderer');
var GraphicUtil = require('./utilities/graphicUtil');

exports['default'] = {
	HtmlPagesRenderer: HtmlPagesRenderer,
	HtmlBookRenderer: HtmlBookRenderer,
	GraphicUtil: GraphicUtil,
	WidgetRenderer: WidgetRenderer
};
module.exports = exports['default'];


},{"./components/HtmlBookRenderer":1,"./components/HtmlPagesRenderer":3,"./components/WidgetRenderer":4,"./utilities/graphicUtil":7}]},{},[]);
