var React = require('react');
var transformToPages = require('../utilities/transformToPages');

var BindToMixin = require('react-binding');
var _ = require('underscore');

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
	//getInitialState: function () {
	//	return {data: this.props.data || {}}
	//},
	createComponent: function (box) {
		var widget = this.props.widgets[box.elementName];
		if (widget === undefined) return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');

		var props = box; //_.omit(box,'style');
		return React.createElement(widget, props, box.content !== undefined ? React.DOM.span(null, box.content) : undefined);
	},
	render: function () {
		
		var pages = transformToPages(this.props.schema,this.props.dataContext.value);

		 //this.bindToState('data');

		//apply two-way binding
		_.each(pages, function (page) {
			_.each(page.boxes, function (node) {
				var box = node.element;
				
				//apply binding
				for (var propName in box) {
					var prop = box[propName];
					//TODO: better test - it is a binding object?
					if (_.isObject(prop) && !!prop.Path && prop.Mode === "TwoWay") {
						//two-way binding
						box.valueLink = this.bindTo(this.props.dataContext, prop.Path);
						box.value = undefined;
						//
						////error - one way binding
						//var error = ref(this.props.errors,prop.Path);
						//if (error !== undefined) {
						//	box.help = error.ErrorMessage;
						//	box.bsStyle = error.HasErrors ? 'error' : '';
						//}

					}
				}
				//if (!!box.Binding) {
				//	if (box.elementName === "ReactBootstrap.Input" || box.elementName === "TextBoxInput" || box.elementName === "CheckBoxInput") {
				//		box.valueLink = this.bindTo(this.props.dataContext, box.Binding);
				//	}
				//}
			}, this)

		}, this);
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

module.exports = HtmlPagesRenderer;
