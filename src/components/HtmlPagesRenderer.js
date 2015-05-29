var React = require('react');
var transformToPages = require('../utilities/transformToPages');
var standardPageSizes = require('./standardPageSizes');

var HtmlPage = React.createClass({
	render: function () {
		//var style = {left:580,position:'absolute'};
		//var component = this.props.errorFlag?React.createElement(this.props.widgets['Shapes.CornerBox'],{text:'', orientation:'topRight',width:70, size:150,style:{}, strokeWidth:1, fill:'darkred'}):React.createElement('span',{});
		var options = this.props.pageOptions;
		//TODO: implement other sizes
		//var paper = {};
		//if (options.height && options.width) {
		//	paper.width = options.width
		//	paper.height = options.height
		//}
		//else {
		//	paper.format = options.format || 'A4'
		//	paper.orientation = options.orientation || 'portrait'
		//}
		
		var dpi = 96;
		var pointToPixel = function(point){ return (point/72) * dpi;};
		var defaultMargin = pointToPixel(21.6);
		
		
		var pageSize = [pointToPixel(standardPageSizes.A4[0]), pointToPixel(standardPageSizes.A4[1])];
		var margins = [defaultMargin,defaultMargin,defaultMargin,defaultMargin];
		
		//if (this.props.errorFlag) classNames += ' errorFlag';
		var pageInnerStyle = { overflow: 'visible',width: pageSize[0] - (margins[0] + margins[2]),height: pageSize[1] - (margins[1] + margins[3]),position: 'relative',backgroundColor: 'transparent'};
		var pageStyle = {width: pageSize[0],height: pageSize[1],paddingTop: margins[0], paddingRight:margins[1],paddingBottom: margins[2], paddingLeft:margins[3],border:'gray 1px solid',backgroundColor:'#ffffff'};
	
		return (
			<div style={pageStyle}>
				<div style={pageInnerStyle}>
					{this.props.children}
				</div>
			</div>
		);
	}
});

var HtmlPagesRenderer = React.createClass({
	createComponent: function (box) {
		var widget = this.props.widgets[box.elementName];
		if (widget === undefined) return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');

		var props = box;
		return React.createElement(widget, props, box.content !== undefined ? React.DOM.span(null, box.content) : undefined);
	},
	render: function () {
		
		var pages = transformToPages(this.props.schema,this.props.data);

		return (
			<div id="section-to-print">
				{pages.map(function (page, i) {
					return (<HtmlPage pageNumber={page.pageNumber} widgets={this.props.widgets} errorFlag={this.props.errorFlag}>
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
