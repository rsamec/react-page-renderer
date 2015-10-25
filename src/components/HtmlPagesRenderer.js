import React from 'react';
import traverse from 'traverse';
import _ from 'lodash';
import BindToMixin from 'react-binding';


import HtmlPage from './HtmlPage.js';
import WidgetRenderer from './WidgetRenderer.js';

import bindToSchema from '../utilities/bindToSchema.js';
import transformToPages from '../utilities/transformToPages';
import standardPageSizes from './../utilities/standardPageSizes';
import {getPathSetRange} from './../utilities/getPathSetRange.js';

import parser from 'falcor-path-syntax';

var HtmlPagesRenderer = React.createClass({
	mixins:[BindToMixin],
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
	componentDidMount(){

		const CONTAINER_NAME = "Container";
		const REPEATER_CONTAINER_NAME = "Repeater";


		var dataBinder = this.props.dataContext;
		if (dataBinder === undefined) return;
		var dataSources = this.bindTo(dataBinder, "dataSources").value;
		if (dataSources == undefined) return;

		var self = this;

		//step -> set repeatable sections (containers) -
		traverse(this.props.schema).forEach(function (x) {
			if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
				var bindingProps = x.props && x.props.binding;


				var binding = self.bindTo(dataBinder, bindingProps.path);


				var pos = bindingProps.path.indexOf('.');
				if (pos === -1) return;

				//grab pathes
				var modelPath = bindingProps.path.substr(0, pos);
				var falcorPath = bindingProps.path.substr(pos + 1);

				if (dataSources[modelPath] === undefined) return;
				var parsedPath = parser(falcorPath);
				var rangeFromPath =getPathSetRange(falcorPath);
				if (rangeFromPath=== undefined) {
					dataSources[modelPath].get(falcorPath + '.length').then(function (response) {
						if (response === undefined) return;
						console.log(binding.path);
						console.log(response.json);
						binding.value = new Array(_.get(response.json, falcorPath).length);
					});
				}

			}
		});
	},
	render: function () {
		var pages = transformToPages(bindToSchema(this.props.schema,this.props.data));
		var ctx = (this.props.schema.props && this.props.schema.props.context) || {};
		var customStyles =ctx['styles'] || {};
		return (
			<div id="section-to-print" style={this.props.style}>
				{pages.map(function (page, i) {
					return (<HtmlPage pageNumber={page.pageNumber} widgets={this.props.widgets} errorFlag={this.props.errorFlag} pageOptions={this.props.pageOptions}>
							{page.boxes.map(function (node, i) {
								var elName = node.element.elementName;
								var widget = <WidgetRenderer widget={this.props.widgets[elName]} node={node.element} customStyle={customStyles[elName]} dataBinder={this.props.dataContext} />;
								return (
									<div style={ node.style}>
										{widget}
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
