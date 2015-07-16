import React from 'react';
import _ from 'underscore';
import BindToMixin from 'react-binding';
import {IntlMixin} from 'react-intl';
import {numberConverter} from '../utilities/converters.js';
import HtmlPage from './HtmlPage.js';

var transformToPages = require('../utilities/transformToPages');
var standardPageSizes = require('./../utilities/standardPageSizes');


var HtmlPagesRenderer = React.createClass({
	mixins:[BindToMixin],
	applyBinding:function(box, dataContext){
		var ref = function (obj, str) {
			return str.split(".").reduce(function(o, x) { return o === undefined?undefined:o[x] }, obj);
		}
		//apply binding
		for (var propName in box){
			var prop = box[propName];
			//TODO: better test - it is a binding object?
			if (_.isObject(prop) && !!prop.Path){
				if (propName === 'onAdd') {
					var selfBinding = this.bindArrayTo(dataContext,prop.Path);
					box.onClick = function(e){ selfBinding.add()}
				}
				else if (propName === 'onRemove'){
					var selfBinding = this.props.arrayContext;
					box.onClick = function(e){  selfBinding.remove(dataContext.value);}
				}
				else if (prop.Mode === "TwoWay") {
					//two-way binding
					var converter;
					if (!!prop.Converter) {
						converter = new numberConverter();

					}

					box.valueLink = converter!==undefined?this.bindTo(dataContext, prop.Path,converter):this.bindTo(dataContext,prop.Path);
					box.value = undefined;

					//error - one way binding
					var error = ref(this.props.errors,prop.Path);
					if (error !== undefined) {
						box.help = error.ErrorMessage;
						box.bsStyle = error.HasErrors ? 'error' : '';
					}
				}
				else{
					//one-way binding
					//box[propName] = this.bindTo(dataContext, prop.Path).value;
				}
			}
		}

	},
	createComponent: function (box) {
		var widget = this.props.widgets[box.elementName];
		if (widget === undefined) return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');

		//optionally add internatialization data
		if (this.props.intlData !== undefined) box = _.extend(box,box.locales !==undefined?_.omit(this.props.intlData,'locales'):this.props.intlData);
		
		
		//optionally add binding
		if (this.props.dataContext !== undefined) this.applyBinding(box,this.props.dataContext);
		
		//render
		return React.createElement(widget, box, box.content !== undefined ? React.DOM.span(null, box.content) : undefined);
	},
	render: function () {
		
		var pages = transformToPages(this.props.schema,this.props.data);
		
		return (
			<div id="section-to-print" style={this.props.style}>
				{pages.map(function (page, i) {
					return (<HtmlPage pageNumber={page.pageNumber} widgets={this.props.widgets} errorFlag={this.props.errorFlag} pageOptions={this.props.pageOptions}>
							{page.boxes.map(function (node, i) {
								var component = this.createComponent(node.element);
								return (
									<div style={ node.style}>
										{component}
									</div>
								);
							}, this)}
					</HtmlPage>)
				}, this)}
			</div>
		);
	}
});

module.exports = HtmlPagesRenderer;
