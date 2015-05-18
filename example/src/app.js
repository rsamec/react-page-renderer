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


const MyModal = React.createClass({
	
	render() {
		var style = {height:'70vh'};
		var schema = this.props.schema || {};
		var businessRules = schema.businessRules || {};
		return (
			<Modal {...this.props} title='Modal heading' animation={false}>
				<div style={style} className='modal-body'>
					<BootstrapPublisher widgets={bootstrapWidgets} schema={schema} rules={businessRules} dataContext={this.props.dataContext} />
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
		return {inputSchema:{"elementName":"ObjectSchema","name":"rootContainer","containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":200,"width":740,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":0,"left":0},"type":"text","placeholder":"type your text","label":"Label","value":{"Path":"From.Name"}}],"containers":[]}],"data":{},"businessRules":{"From":{"type":"object","properties":{"Name":{"type":"string","title":"First name","required":"true","maxLength":"15"},"LastName":{"type":"string","title":"Last name","required":"true","maxLength":"15"}}}}}}
			
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
