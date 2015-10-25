import React from 'react';
import _ from 'lodash';
import GraphicPrimitive from '../utilities/graphicUtil.js';
import HtmlPagesRenderer from './HtmlPagesRenderer.js';

var HtmlBookRenderer = React.createClass({
	componentDidMount: function () {
		$(this.getDOMNode()).turn({gradients: false, acceleration: true, autoCenter:true});
	},
	render: function () {
		var pageSize =  GraphicPrimitive.DefaultPageSizeInPx;
		var bookStyle = {width: pageSize[0] * 2, height: pageSize[1]};
		var cloneProps = _.extend(this.props, {style:bookStyle});
		
		return React.createElement(HtmlPagesRenderer, cloneProps);
	}
});

module.exports = HtmlBookRenderer;
