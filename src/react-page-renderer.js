var HtmlPagesRenderer = require('./components/HtmlPagesRenderer');
var HtmlBookRenderer = require('./components/HtmlBookRenderer');
var WidgetRenderer = require('./components/WidgetRenderer');
var GraphicUtil = require('./utilities/graphicUtil');
var BindingUtil  = {
	bindToSchema: require('./utilities/bindToSchema'),
	bindToSchemaAsync:require('./utilities/bindToSchemaAsync')
}

export default {
	HtmlPagesRenderer:HtmlPagesRenderer,
	HtmlBookRenderer:HtmlBookRenderer,
	GraphicUtil:GraphicUtil,
	BindingUtil:BindingUtil,
	WidgetRenderer:WidgetRenderer
};
