import React from 'react';
import GraphicPrimitive from '../utilities/graphicUtil.js';

var HtmlPage = React.createClass({
	render: function () {
		//var style = {left:580,position:'absolute'};
		//var component = this.props.errorFlag?React.createElement(this.props.widgets['Shapes.CornerBox'],{text:'', orientation:'topRight',width:70, size:150,style:{}, strokeWidth:1, fill:'darkred'}):React.createElement('span',{});
		var options = this.props.pageOptions;

		var pageSize =  GraphicPrimitive.DefaultPageSize;
		if (options !== undefined && options.height && options.width) {
			pageSize = [options.width, options.height];
		}
		//TODO: implement other sizes
		//else {
		//	paper.format = options.format || 'A4'
		//	paper.orientation = options.orientation || 'portrait'
		//}

		var defaultMargin = GraphicPrimitive.DefaultMargin;
		var pointToPixel = GraphicPrimitive.pointToPixel;
		
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
			border: (options && options.border) || 'gray 1px solid',
			backgroundColor: '#ffffff'
		};


		return (
			<div>
				<div style={pageStyle}>
					<div style={pageInnerStyle}>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = HtmlPage;
