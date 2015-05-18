var React = require('react');

var transformToPages = require('../utilities/transformToPages');
var createChainedFunction = require('../utilities/createChainedFunction');


var pdfKitService = require('../services/pdfKitService');
var pdfHummusService = require('../services/pdfHummusService');

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

module.exports = PDFPagesTrigger;

