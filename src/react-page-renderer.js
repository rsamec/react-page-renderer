var React = require('react');
var transformToPages = require('./utilities/transformToPages');
var deepClone = require('./utilities/deepClone');
var createChainedFunction = require('./utilities/createChainedFunction');

var BindToMixin = require('react-binding');
var _ = require('underscore');

var pdfKitService = require('./services/pdfKitService');
var pdfHummusService = require('./services/pdfHummusService');

var HtmlPage = React.createClass({
	render: function () {
		return (
			<div className="cPageOuter">
				<div className="cPage">
			{this.props.children}
				</div>
			</div>
		);
	}
});

var HtmlPagesRenderer = React.createClass({
	mixins: [BindToMixin],
	getInitialState: function () {
		return {data: this.props.data || {}}
	},
	createComponent: function (box) {
		var widget = this.props.widgets[box.elementName];
		if (widget === undefined) return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');

		var props = box; //_.omit(box,'style');
		return React.createElement(widget, props, box.content !== undefined ? React.DOM.span(null, box.content) : undefined);
	},
	render: function () {
		var pages = transformToPages(this.props.schema, this.state.data);

		var data = this.bindToState('data');

		//apply two-way binding
		_.each(pages, function (page) {
			_.each(page.boxes, function (node) {
				var box = node.element;
				if (!!box.Binding) {
					if (box.elementName === "ReactBootstrap.Input" || box.elementName === "TextBoxInput" || box.elementName === "CheckBoxInput") {
						box.valueLink = this.bindTo(data, box.Binding);
					}
				}
			}, this)

		}, this)
		return (
			<div id="section-to-print">
		{pages.map(function (page, i) {
			return (<HtmlPage pageNumber={page.pageNumber}>
		{page.boxes.map(function (node, i) {
			var element = node.element;
			var style = node.style;
			var component = this.createComponent(element);
			return (
				<div style={style}>
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

var PDFPagesTrigger = React.createClass({
	getPDFService(type){
		if (type === "pdfHummus") return new pdfHummusService();
		return new pdfKitService();
	},
	openNewWindow() {
		var pages = transformToPages(this.props.schema,this.props.data);
		
		this.getPDFService(this.props.type).generatePDFDocument(pages, function (url) {
			window.open(url);
		});
	},
	render: function() {
		var child = React.Children.only(this.props.children);
		return React.cloneElement(child,{onClick: createChainedFunction(child.props.onClick, this.openNewWindow)});
	}
});

module.exports = {
	HtmlPagesRenderer:HtmlPagesRenderer,
	PDFPagesTrigger:PDFPagesTrigger
	
};
