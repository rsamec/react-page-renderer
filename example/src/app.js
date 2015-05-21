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
					<pre>{JSON.stringify(this.props.dataContext.value)}</pre>
					<Button onClick={this.props.onRequestHide}>Close</Button>
				</div>
			</Modal>
		);
	}
});

var App = React.createClass({
	mixins:[BindToMixin],
	getInitialState(){
		return {inputSchema:
		{"elementName":"ObjectSchema","name":"rootContainer","containers":[{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":200,"width":740,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":0,"left":0},"type":"text","placeholder":"type your firm name","label":"Company name","value":{"Path":"From.Name","Mode":"TwoWay"}}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":300,"width":736,"position":"relative"},"boxes":[],"containers":[{"name":"repeater","elementName":"Repeater","style":{"top":0,"left":0,"height":72,"width":740,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":0,"left":0},"type":"text","placeholder":"type your description","label":"Description","value":{"Path":"Description","Mode":"TwoWay"}},{"name":"Copy ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":-2,"left":202},"type":"number","placeholder":"units","label":"Units","value":{"Path":"Quantity.Units","Mode":"TwoWay"}},{"name":"Copy Copy ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":1,"left":396},"type":"number","placeholder":"price","label":"Unit price","value":{"Path":"Quantity.UnitPrice","Mode":"TwoWay"}},{"name":"JSXBox","elementName":"JSXBox","style":{"top":29,"left":584},"content":"var data = props.Binding;\nvar total = data.Units * data.UnitPrice\nreturn <div><strong>{total}</strong></div>","Binding":{"Path":"Quantity"}},{"name":"ReactBootstrap.Button","elementName":"ReactBootstrap.Button","style":{"top":20,"left":646},"bsSize":"medium","content":"Remove","onClick":{"Path":"Items"},"onRemove":{"Path":"Items"}}],"containers":[],"Binding":{"Path":"Items"}},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":51,"width":226,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Button","elementName":"ReactBootstrap.Button","style":{"top":-1,"left":9},"bsSize":"medium","content":"Add","onClick":{"Path":"Items"},"onAdd":{"Path":"Items"}}],"containers":[]}],"Visibility":{}}],"data":{"From":{"Name":"Creative invoice","Address":{"Street":"Ulic","Number":"cp","ZipCode":"100 00","City":"PRAHA 10","State":"Czech Republic"}},"To":{"Name":"Customer","Address":{"Street":"Hello","Number":"55","ZipCode":"300 00","City":"London","State":"Great Britain"}},"Items":[{"Quantity":{"Units":10,"UnitPrice":20},"Description":"Creative invoice desing"},{"Quantity":{"Units":10,"UnitPrice":200},"Description":"Creative invoice desing"},{"Quantity":{"Units":2,"UnitPrice":200},"Description":"Prepare colors"},{"Quantity":{"Units":1,"UnitPrice":400},"Description":"Draw images for invoice desing"},{"Quantity":{"Units":5,"UnitPrice":10},"Description":"Testing and deployment"}]},"businessRules":{"From":{"type":"object","properties":{"Name":{"type":"string","title":"First name","required":"true","maxLength":"15"},"LastName":{"type":"string","title":"Last name","required":"true","maxLength":"15"}}}}}
		}
			
	},
	componentDidMount() {
		var texts = {"elementName":"ObjectSchema","name":"rootContainer","containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":103,"width":745,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":46,"left":2},"content":"<p>Each inline text can be <em>styled</em> <strong>independently</strong> <span style=\"text-decoration: underline;\">then</span>.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"This is a header","font":{"bold":true,"size":18}}],"containers":[]},{"name":"paragraph","elementName":"Container","style":{"top":0,"left":0,"height":776,"width":752,"position":"relative"},"boxes":[],"containers":[{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":51,"width":747,"position":"relative"},"boxes":[{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Simple paragraphs","font":{"bold":true,"size":16}}],"containers":[]},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Left aligned","font":{"bold":true}}],"containers":[]},{"name":"centre","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":40,"left":0},"content":"<p style=\"text-align: center;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Centre aligned","font":{"bold":true}}],"containers":[]},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: right;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Right aligned","font":{"bold":true}}],"containers":[]},{"name":"justified","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: justify;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Justified aligned","font":{"bold":true}}],"containers":[]}]},{"name":"paragraphColumns","elementName":"Container","style":{"top":0,"left":0,"height":916,"width":751,"position":"relative"},"boxes":[],"containers":[{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":34,"width":746,"position":"relative"},"boxes":[{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Paragraph with columns","font":{"bold":true,"size":16}}],"containers":[],"startOnNewPage":true},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":204,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":3},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Left aligned","font":{"bold":true}}],"containers":[]},{"name":"centre","elementName":"Container","style":{"top":0,"left":0,"height":219,"width":740,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":40,"left":0},"content":"<p style=\"text-align: center;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":4},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Centre aligned","font":{"bold":true}}],"containers":[]},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":205,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: right;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":2},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Right aligned","font":{"bold":true}}],"containers":[]},{"name":"justified","elementName":"Container","style":{"top":0,"left":0,"height":219,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: justify;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":4},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Justified aligned","font":{"bold":true}}],"containers":[]}]}],"data":{}};
		this.setState({
			printSchema: texts,
			data:texts.data || {}
		});
		
		//request.get('http://hand-formvalidation.rhcloud.com/assets/examples/Invoice.json')
		//	.end(function(err, res){
		//		if (res.ok) {
		//			if (this.isMounted()) {
		//				//alert(JSON.stringify(res.body));
		//				var schema = res.body;
		//				this.setState({
		//					printSchema: schema,
		//					data:schema.data || {}
		//				});
		//			}
		//		} else {
		//			alert('Oh no! error ' + res.text);
		//		}
		//	}.bind(this));
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
