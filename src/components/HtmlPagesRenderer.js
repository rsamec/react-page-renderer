import React from 'react';
import HtmlPage from './HtmlPage.js';
import WidgetRenderer from './WidgetRenderer.js';
import transformToPages from '../utilities/transformToPages';

var HtmlPagesRenderer = React.createClass({

	render: function () {
		var pages = transformToPages(this.props.schema);
		var ctx = (this.props.schema.props && this.props.schema.props.context) || {};
		var customStyles = ctx['styles'] || {};
		return (
			<div id="section-to-print" style={this.props.style}>
				{pages.map(function (page, i) {
					return (<HtmlPage key={'page' + i} pageNumber={page.pageNumber} widgets={this.props.widgets}
									  errorFlag={this.props.errorFlag} pageOptions={this.props.pageOptions}>
						{page.boxes.map(function (node, j) {
							var elName = node.element.elementName;
							var widget = <WidgetRenderer key={'page' + i + '_' + j} widget={this.props.widgets[elName]} node={node.element}
														 customStyle={customStyles[elName]}
														 dataBinder={this.props.dataContext}
														 onFetch={this.props.onFetch}/>;
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
