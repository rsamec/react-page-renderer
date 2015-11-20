import React from 'react';
import HtmlPage from './HtmlPage.js';
import GraphicPrimitive from '../utilities/graphicUtil.js';
import WidgetRenderer from './WidgetRenderer.js';
import transformToPages from '../utilities/transformToPages';

var HtmlPagesRenderer = React.createClass({

	render: function () {
		var pageOptions =this.props.pageOptions || {};
		var pageHeight = pageOptions.height || GraphicPrimitive.DefaultPageSize[1];
		var pageMargin = pageOptions.margin || {};
		if (pageMargin.top !== undefined) pageHeight -=pageMargin.top;
		if (pageMargin.bottom !== undefined) pageHeight -=pageMargin.bottom;

		var pages = this.props.pages;
		if (pages === undefined) pages = transformToPages(this.props.schema,GraphicPrimitive.pointToPixel(pageHeight));
		var ctx = (this.props.schema.props && this.props.schema.props.context) || {};
		var customStyles = ctx['styles'] || {};
		var code = ctx['code'] && ctx['code'].code;
		var customCode = !!code? new Function(code)():undefined;


		return (
			<div id="section-to-print" style={this.props.style}>
				{pages.map(function (page, i) {
					return (<HtmlPage key={'page' + i} pageNumber={page.pageNumber} widgets={this.props.widgets}
									  errorFlag={this.props.errorFlag} pageOptions={this.props.pageOptions}>
						{page.boxes.map(function (node, j) {
							var elName = node.element.elementName;
							var widget = <WidgetRenderer key={'page' + i + '_' + j} widget={this.props.widgets[elName]} node={node.element}
														 customStyle={customStyles[elName]}
														 customCode={customCode}
														 dataBinder={this.props.dataContext}
														 asyncRenderer ={ this.props.asyncRenderer}
														 onFetch={this.props.onFetch}/>;
							return (
								<div style={ node.style}>
									<div id={node.element.name}>{widget}</div>
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
