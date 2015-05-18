var React = require('react');
var BindToMixin = require('react-binding');
var HtmlPagesRenderer = require('react-page-renderer').HtmlPagesRenderer;
var PDFPagesTrigger = require('react-page-renderer').PDFPagesTrigger;
var BootstrapPublisher = require('react-page-renderer').BootstrapPublisher;

var WidgetFactory = require('react-designer-widgets');
var widgets = new WidgetFactory().getWidgets();

var _ = require('underscore');

//external widgets with more controls
var ReactBootstrap = require('react-bootstrap');
var bootstrapWidgets = {};
	_.each(['Input','Button', 'Panel','Glyphicon','Tooltip','Alert','Label'],function(widgetName){
		var name = 'ReactBootstrap.' + widgetName;
		bootstrapWidgets[name] = ReactBootstrap[widgetName];
	});

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;

var request = require('superagent');

var businessRules = {
	"Employee": {
		"type": "object",
		"properties": {
			"FirstName": {
				"type": "string",
				"title": "First name",
				"required": "true",
				"maxLength": "15"
			},
			"LastName": {
				"type": "string",
				"title": "Last name",
				"required": "true",
				"maxLength": "15"
			}
		}
	}
}
const MyModal = React.createClass({
	
	render() {
		var style = {height:'70vh'};
		return (
			<Modal {...this.props} title='Modal heading' animation={false}>
				<div style={style} className='modal-body'>
					<BootstrapPublisher widgets={bootstrapWidgets} schema={this.props.schema} rules={businessRules} dataContext={this.props.dataContext} />
				</div>
				<div className='modal-footer'>
					<Button onClick={this.props.onRequestHide}>Close</Button>
				</div>
			</Modal>
		);
	}
});

var App = React.createClass({
	mixins:[BindToMixin],
	getInitialState(){
		return {inputSchema:{
			"containers": [
				{
					"name": "sec80989847",
					"elementName": "Container",
					"style": {
						"top": 0,
						"left": 0,
						"height": 116,
						"width": 798,
						"position": "relative"
					},
					"boxes": [
						{
							"name": "ctBootstrap.Input63433383",
							"elementName": "ReactBootstrap.Input",
							"style": {
								"top": 6,
								"left": 7
							},
							"placeholder": "type your first name",
							"type": "text",
							"label": "First Name",
							"Binding": "From.Name"
						},
						{
							"name": "ctBootstrap.Input22938084",
							"elementName": "ReactBootstrap.Input",
							"style": {
								"top": 6,
								"left": 210
							},
							"type": "text",
							"placeholder": "type your surname",
							"label": "Last Name",
							"Binding": "Employee.LastName"
						},
						{
							"name": "ctBootstrap.Glyphicon47712437",
							"elementName": "ReactBootstrap.Glyphicon",
							"style": {
								"top": 26,
								"left": 544
							},
							"glyph": "eur"
						},
						{
							"name": "ctBootstrap.Button34757314",
							"elementName": "ReactBootstrap.Button",
							"style": {
								"top": 23,
								"left": 428
							},
							"bsStyle": "danger",
							"bsSize": "smaller",
							"content": "Add"
						}
					],
					"containers": []
				},
				{
					"name": "sec44472784",
					"elementName": "Container",
					"style": {
						"top": 0,
						"left": 0,
						"height": 200,
						"width": 800,
						"position": "relative"
					},
					"boxes": [
						{
							"name": "yMceEditor08800700",
							"elementName": "TinyMceEditor",
							"style": {
								"top": 6,
								"left": 3
							},
							"content": "<p><span style=\"color: rgb(51, 51, 51); font-family: Ubuntu, Tahoma, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px;\">R Markdown is an authoring format that enables easy creation of dynamic documents, presentations, and reports from R. It combines the core syntax of&nbsp;</span><a href=\"http://daringfireball.net/projects/markdown/basics\" style=\"box-sizing: border-box; color: rgb(221, 72, 20); text-decoration: none; font-family: Ubuntu, Tahoma, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px;\">markdown</a><span style=\"color: rgb(51, 51, 51); font-family: Ubuntu, Tahoma, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px;\">&nbsp;(an easy-to-write plain text format) with embedded R code chunks that are run so their output can be included in the final document. R Markdown documents are fully&nbsp;</span><em style=\"box-sizing: border-box; color: rgb(51, 51, 51); font-family: Ubuntu, Tahoma, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px;\">reproducible</em><span style=\"color: rgb(51, 51, 51); font-family: Ubuntu, Tahoma, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px;\">&nbsp;(they can be automatically regenerated whenever underlying R code or data changes).</span><br></p>"
						}
					],
					"containers": []
				},
				{
					"name": "sec33022331",
					"elementName": "Container",
					"style": {
						"top": 0,
						"left": 0,
						"height": 200,
						"width": 800,
						"position": "relative"
					},
					"boxes": [
						{
							"name": "ct.Griddle53464075",
							"elementName": "React.Griddle",
							"style": {
								"top": 0,
								"left": 0
							},
							"results": [
								{
									"FirstName": "Karel",
									"LastName": "Novak",
									"Email": "r2@gmail.cz",
									"Address": "Moskva"
								}
							],
							"showFilter": true,
							"showSettings": true
						}
					],
					"containers": []
				},
				{
					"name": "sec96561242",
					"elementName": "Container",
					"style": {
						"top": 0,
						"left": 0,
						"height": 278,
						"width": 813,
						"position": "relative"
					},
					"boxes": [
						{
							"name": "ctD3.LineChart24513352",
							"elementName": "ReactD3.LineChart",
							"style": {
								"top": 0,
								"left": 1
							},
							"width": "300",
							"title": "Lines",
							"data": {
								"values": [
									{
										"x": "1",
										"y": "200"
									},
									{
										"x": "2",
										"y": "100"
									},
									{
										"x": "3",
										"y": "150"
									}
								]
							},
							"height": "200"
						}
					],
					"containers": []
				}
			]
		}}	
	},
	componentDidMount() {
		
		request.get('http://hand-formvalidation.rhcloud.com/assets/examples/Invoice.json')
			.end(function(err, res){
				if (res.ok) {
					if (this.isMounted()) {
						//alert(JSON.stringify(res.body));
						var schema = res.body;
						this.setState({
							printSchema: schema,
							data:schema.data || {}
						});
					}
				} else {
					alert('Oh no! error ' + res.text);
				}
			}.bind(this));
	},
	render: function() {
		
		var printSchema = this.state.printSchema;
		if (printSchema === undefined) return (<div>Loading ...</div>);
		var dataContext = this.bindToState('data');
		return (
			<div>
				<div>
					<PDFPagesTrigger schema={printSchema} data={this.state.data}>
						<input type="button" value="PDF Kit" />
					</PDFPagesTrigger>
					<PDFPagesTrigger type='pdfHummus' schema={printSchema} data={this.state.data}>
						<input type="button" value="PDF Hummus" />
					</PDFPagesTrigger>
					<ModalTrigger modal={<MyModal schema={this.state.inputSchema} dataContext={dataContext} />}>
						<input type="button" value="modal" />
					</ModalTrigger>
				</div>
				<HtmlPagesRenderer widgets={widgets} schema={printSchema} dataContext={dataContext} />
			</div>
		)
	}
});

React.render(<App />, document.getElementById('app'));
