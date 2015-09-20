import React from 'react';
import _ from 'lodash';
//import BindToMixin from 'react-binding';
import {IntlMixin} from 'react-intl';

import HtmlPage from './HtmlPage.js';
import WidgetRenderer from './WidgetRenderer.js';

import transformToPages from '../utilities/transformToPages';
import standardPageSizes from './../utilities/standardPageSizes';


var HtmlPagesRenderer = React.createClass({
	//mixins:[BindToMixin],
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
	render: function () {
		
		var pages = transformToPages(this.props.schema,this.props.data);
		
		return (
			<div id="section-to-print" style={this.props.style}>
				{pages.map(function (page, i) {
					return (<HtmlPage pageNumber={page.pageNumber} widgets={this.props.widgets} errorFlag={this.props.errorFlag} pageOptions={this.props.pageOptions}>
							{page.boxes.map(function (node, i) {
								var widget = <WidgetRenderer widget={this.props.widgets[node.element.elementName]} node={node.element} dataBinder={this.props.dataContext} />;
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
