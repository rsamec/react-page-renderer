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

	_.each(['Input','Button', 'Panel','Glyphicon','Tooltip','Alert','Label'],function(widgetName){
		var name = 'ReactBootstrap.' + widgetName;
		widgets[name] = ReactBootstrap[widgetName];
	});

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;

var FormattedMessage = require('react-intl').FormattedMessage;
widgets[FormattedMessage];
var request = require('superagent');


const MyModal = React.createClass({
	
	render() {
		var style = {height:'70vh'};
		var schema = this.props.schema || {};
		var businessRules = schema.businessRules || {};
		return (
			<Modal {...this.props} bsSize='large' title='Modal heading' animation={false}>
				<div style={style} className='modal-body'>
					<BootstrapPublisher widgets={widgets} schema={schema} rules={businessRules} dataContext={this.props.dataContext} />
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
		var schema =
		//{"elementName":"ObjectSchema","name":"SimpleInvoice_Input","containers":[{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":106,"width":748,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":0,"left":0},"type":"text","placeholder":"type your firm name","label":"Supplier","value":{"Path":"From.Name","Mode":"TwoWay"}}],"containers":[]},{"name":"Copy header","elementName":"Container","style":{"top":0,"left":0,"height":106,"width":748,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":0,"left":0},"type":"text","placeholder":"type your firm name","label":"Customer","value":{"Path":"To.Name","Mode":"TwoWay"}}],"containers":[],"Visibility":{"Path":""}},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":186,"width":751,"position":"relative"},"boxes":[],"containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":51,"width":226,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Button","elementName":"ReactBootstrap.Button","style":{"top":0,"left":4},"bsSize":"medium","content":"add","onAdd":{"Path":"Items"}}],"containers":[]},{"name":"repeater","elementName":"Repeater","style":{"top":0,"left":0,"height":91,"width":740,"position":"relative"},"boxes":[{"name":"ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":0,"left":0,"width":300},"type":"text","placeholder":"type your description","label":"Description","value":{"Path":"Description","Mode":"TwoWay"}},{"name":"Copy ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":0,"left":328,"width":100},"type":"number","placeholder":"units","label":"Units","value":{"Path":"Quantity.Units","Converter":"Number","Mode":"TwoWay"}},{"name":"Copy Copy ReactBootstrap.Input","elementName":"ReactBootstrap.Input","style":{"top":-1,"left":461,"width":100},"type":"number","placeholder":"price","label":"Unit price","value":{"Path":"Quantity.UnitPrice","Converter":"Number","Mode":"TwoWay"}},{"name":"JSXBox","elementName":"JSXBox","style":{"top":29,"left":584},"content":"var data = props.Binding;\nvar total = data.Units * data.UnitPrice\nreturn <div><strong>{total}</strong></div>","Binding":{"Path":"Quantity"}},{"name":"ReactBootstrap.Button","elementName":"ReactBootstrap.Button","style":{"top":21,"left":631},"bsSize":"medium","content":"remove","onAdd":{},"onRemove":{"Path":"Items"}}],"containers":[],"Binding":{"Path":"Items"}},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":29,"width":736,"position":"relative"},"boxes":[],"containers":[]}],"Visibility":{}}],"data":{"From":{"Name":"Creative invoice","Address":{"Street":"Ulic","Number":"cp","ZipCode":"100 00","City":"PRAHA 10","State":"Czech Republic"}},"To":{"Name":"Customer","Address":{"Street":"Hello","Number":"55","ZipCode":"300 00","City":"London","State":"Great Britain"}},"Items":[{"Quantity":{"Units":10,"UnitPrice":20},"Description":"Creative invoice desing"},{"Quantity":{"Units":10,"UnitPrice":200},"Description":"Creative invoice desing"},{"Quantity":{"Units":2,"UnitPrice":200},"Description":"Prepare colors"},{"Quantity":{"Units":1,"UnitPrice":400},"Description":"Draw images for invoice desing"},{"Quantity":{"Units":5,"UnitPrice":10},"Description":"Testing and deployment"}]},"businessRules":{"From":{"type":"object","properties":{"Name":{"type":"string","title":"First name","required":"true","maxLength":"100"}}},"Items":{"type":"array","items":{"type":"object","properties":{"Description":{"type":"string","title":"Description","required":"true","maxLength":100},"Quantity":{"type":"object","properties":{"Units":{"type":"number","title":"Units","required":"true","minimum":1,"maximum":1000},"UnitPrice":{"type":"number","title":"UnitPrice","required":"true","minimum":1,"maximum":100000}}}}},"maxItems":4,"minItems":2}},"input":true,"title":"Invoice - input"}
		{"elementName":"ObjectSchema","name":"rootContainer","containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":200,"width":740,"position":"relative"},"boxes":[{"name":"JSXBox","elementName":"JSXBox","style":{"top":0,"left":0},"content":"var valueModel = props.valueLink;\nif (valueModel === undefined) {valueModel = {value:1000};}\nreturn <div>\n     <ul>\n  \t\t\t\t<li><FormattedNumber value={valueModel.value} style=\"currency\"  currency=\"USD\" /></li>\n                <li><FormattedNumber value={valueModel.value} /></li>\n                <li><FormattedNumber value={valueModel.value} format=\"percentage\" /></li>\n                <li><FormattedNumber value={valueModel.value} format=\"USD\" /></li>\n     </ul>\n</div>","Binding":{"Path":"amount","Mode":"TwoWay"},"code":"(function() {var valueModel = props.valueLink;\nif (valueModel === undefined) {valueModel = {value:1000};}\nreturn React.createElement(\"div\", null, \n     React.createElement(\"ul\", null, \n  \t\t\t\tReact.createElement(\"li\", null, React.createElement(FormattedNumber, {value: valueModel.value, style: \"currency\", currency: \"USD\"})), \n                React.createElement(\"li\", null, React.createElement(FormattedNumber, {value: valueModel.value})), \n                React.createElement(\"li\", null, React.createElement(FormattedNumber, {value: valueModel.value, format: \"percentage\"})), \n                React.createElement(\"li\", null, React.createElement(FormattedNumber, {value: valueModel.value, format: \"USD\"}))\n     )\n)})();","locales":{"Path":"locales"}}],"containers":[]}],"data":{"amount":60000,"locales":["cs-CZ"]},"intlData":{"locales":"en-US","formats":{"number":{"USD":{"style":"currency","currency":"CZE","minimumFractionDigits":2},"percentage":{"style":"percent"}}}}}
		//var schema = {"elementName":"ObjectSchema","name":"rootContainer","containers":[{"name":"secHeader","elementName":"Container","style":{"top":0,"left":0,"height":117,"width":750,"position":"relative"},"boxes":[{"name":"Shapes.Rectangle","elementName":"Shapes.Rectangle","style":{"top":0,"left":null,"width":740,"height":80},"height":80,"width":780,"x":0,"y":0,"stroke":"#000000","fill":"#1b88bc","strokeWidth":0},{"name":"TextBox","elementName":"TextBox","style":{"top":16,"left":9},"content":"Creative invoice","font":{"bold":true,"size":36,"italic":false,"underline":false,"color":"#fdfbfb"}},{"name":"TextBox","elementName":"TextBox","style":{"top":13,"left":627},"content":"react-designer","font":{"color":"#faf7f7","bold":true}}],"containers":[]},{"name":"secFirm","elementName":"Container","style":{"top":0,"left":0,"height":166,"width":756,"position":"relative"},"boxes":[],"containers":[{"name":"secFrom","elementName":"Container","style":{"top":0,"left":0,"height":152,"width":365,"position":"relative"},"boxes":[{"name":"Copy Shapes.Rectangle","elementName":"Shapes.Rectangle","style":{"top":0,"left":0,"width":350,"height":40},"height":30,"width":400,"x":0,"y":0,"stroke":"#000000","fill":"#1b88bc","strokeWidth":0},{"name":"TextBox","elementName":"TextBox","style":{"top":-2,"left":7},"content":"From","font":{"color":"#f6efef","bold":true,"size":20}},{"name":"ValueBox","elementName":"ValueBox","style":{"top":61,"left":85},"emptyValue":"---","Binding":"From.Name","content":{"Path":"From.Name"}},{"name":"JSXBox","elementName":"JSXBox","style":{"top":98,"left":89},"content":"var address = props.Binding;\nreturn <div>{address.Street} {address.Number}, {address.ZipCode} {address.City}, {address.State}</div>","Binding":{"Path":"From.Address"}},{"name":"ImageBox","elementName":"ImageBox","style":{"top":60,"left":0},"url":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSubbeuNMYlu9FiPy-JyLPyDfhQbYvyLTGgnLKHkTqXMX-mxRWqkg","width":79}],"containers":[]},{"name":"Copy secFrom","elementName":"Container","style":{"top":-150,"left":381,"height":152,"width":365,"position":"relative"},"boxes":[{"name":"Copy Shapes.Rectangle","elementName":"Shapes.Rectangle","style":{"top":0,"left":0,"width":350,"height":40},"height":30,"width":400,"x":0,"y":0,"stroke":"#000000","fill":"#1b88bc","strokeWidth":0},{"name":"TextBox","elementName":"TextBox","style":{"top":-2,"left":7},"content":"To","font":{"color":"#f6efef","bold":true,"size":20}},{"name":"ValueBox","elementName":"ValueBox","style":{"top":61,"left":85},"emptyValue":"---","Binding":"From.Name","content":{"Path":"To.Name"}},{"name":"JSXBox","elementName":"JSXBox","style":{"top":98,"left":89},"content":"var address = props.Binding;\nreturn <div>{address.Street} {address.Number}, {address.ZipCode} {address.City}, {address.State}</div>","Binding":{"Path":"To.Address"}},{"name":"ImageBox","elementName":"ImageBox","style":{"top":60,"left":0},"url":"http://www.wildspiritwolfsanctuary.org/images/button/chrome.png","width":71}],"containers":[],"left":5}],"left":-1},{"name":"repeater","elementName":"Container","style":{"top":0,"left":0,"height":227,"width":740,"position":"relative"},"boxes":[],"containers":[{"name":"secItems","elementName":"Container","style":{"top":0,"left":0,"height":76,"width":754,"position":"relative"},"boxes":[{"name":"Shapes.Rectangle","elementName":"Shapes.Rectangle","style":{"top":11,"left":-7,"width":740},"height":48,"width":739,"x":0,"y":0,"stroke":"#f7fbfb","fill":"#143994","strokeWidth":2},{"name":"Copy TextBox","elementName":"TextBox","style":{"top":17,"left":14},"content":"Items","font":{"underline":false,"bold":true,"size":24,"color":"#faf9f9"}}],"containers":[]},{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":30,"width":763,"position":"relative"},"boxes":[{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Quantity","font":{"bold":true}},{"name":"Copy TextBox","elementName":"TextBox","style":{"top":1,"left":117},"content":"Description","font":{"bold":true}},{"name":"lab","elementName":"TextBox","style":{"top":0,"left":458},"content":"Unit Price","font":{"bold":true}},{"name":"Copy lab","elementName":"TextBox","style":{"top":2,"left":575},"content":"Total","font":{"bold":true}}],"containers":[]},{"name":"Copy secFooter","elementName":"Container","style":{"top":0,"left":0,"height":10,"width":740,"position":"relative"},"boxes":[{"name":"Shapes.Line","elementName":"Shapes.Line","style":{"top":0,"left":0,"height":15,"width":740},"x1":0,"y1":0,"x2":750,"y2":0,"stroke":"black","fill":"none","strokeWidth":6}],"containers":[]},{"name":"repeater","elementName":"Repeater","style":{"top":0,"left":0,"height":48,"width":740,"position":"relative"},"boxes":[{"name":"ValueBox","elementName":"ValueBox","style":{"top":0,"left":0},"emptyValue":"---","Binding":"HobbyName","font":{"bold":false},"content":{"Path":"Quantity.Units"}},{"name":"ReactBootstrap.Label","elementName":"ReactBootstrap.Label","style":{"top":3,"left":638},"bsSize":"medium","content":"type your content","bsStyle":"success"},{"name":"Copy ValueBox","elementName":"ValueBox","style":{"top":-1,"left":115},"emptyValue":"---","Binding":"HobbyName","font":{"bold":true},"content":{"Path":"Description"}},{"name":"unitPrice","elementName":"ValueBox","style":{"top":0,"left":454},"emptyValue":"---","Binding":"HobbyName","font":{"bold":false},"content":{"Path":"Quantity.UnitPrice"}},{"name":"JSXBox","elementName":"JSXBox","style":{"top":2,"left":577},"content":"var data = props.Binding;\nvar total = data.Units * data.UnitPrice\nreturn <div><strong>{total}</strong></div>","Binding":{"Path":"Quantity"}}],"containers":[],"Binding":{"Path":"Items"}},{"name":"secFooter","elementName":"Container","style":{"top":0,"left":0,"height":40,"width":740,"position":"relative"},"boxes":[{"name":"Shapes.Line","elementName":"Shapes.Line","style":{"top":0,"left":0,"height":10,"width":740},"x1":0,"y1":0,"x2":750,"y2":0,"stroke":"black","fill":"none","strokeWidth":6}],"containers":[]}]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":117,"width":740,"position":"relative"},"boxes":[{"name":"TextBox","elementName":"TextBox","style":{"top":7,"left":608},"content":"Amount Due","font":{"bold":true,"size":17}},{"name":"JSXBox","elementName":"JSXBox","style":{"top":48,"left":610},"content":"var items = props.Binding;\nvar total = 0;\nfor (var i in items){\n  var q = items[i].Quantity;\n  total +=q.Units * q.UnitPrice;\n}\nreturn <div style={{fontSize:'20px'}}><strong>{total}</strong></div>","Binding":{"Path":"Items"}}],"containers":[{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":156,"width":500,"position":"relative"},"boxes":[{"name":"HtmlBox1","elementName":"HtmlBox","style":{"top":0,"left":0},"content":"<p>Here is the descriptions about provided services and negotiated working conditions. Here is the descriptions about provided services and negotiated working conditions. Here is the descriptions about provided services and negotiated working conditions. Here is the descriptions about provided services and negotiated working conditions.</p>","columnCount":1}],"containers":[]}]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":119,"width":759,"position":"relative"},"boxes":[{"name":"TextBox","elementName":"TextBox","style":{"top":80,"left":6},"content":"Thank you very much for choosing us. It was pleasure to work with you.","font":{"bold":true,"size":16}},{"name":"ImageBox","elementName":"ImageBox","style":{"top":-26,"left":199},"url":"http://www.vietnamstay.travel/FileManager/Logo_Khachhang/Payment_logo.jpg"}],"containers":[]}],"data":{"From":{"Name":"Creative invoice","Address":{"Street":"Ulic","Number":"cp","ZipCode":"100 00","City":"PRAHA 10","State":"Czech Republic"}},"To":{"Name":"Customer","Address":{"Street":"Hello","Number":"55","ZipCode":"300 00","City":"London","State":"Great Britain"}},"Items":[{"Quantity":{"Units":10,"UnitPrice":20},"Description":"Creative invoice desing"},{"Quantity":{"Units":10,"UnitPrice":200},"Description":"Creative invoice desing"},{"Quantity":{"Units":2,"UnitPrice":200},"Description":"Prepare colors"},{"Quantity":{"Units":1,"UnitPrice":400},"Description":"Draw images for invoice desing"},{"Quantity":{"Units":5,"UnitPrice":10},"Description":"Testing and deployment"}]}};
		//{"elementName":"ObjectSchema","name":"rootContainer","containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":103,"width":745,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":46,"left":2},"content":"<p>Each inline text can be <em>styled</em> <strong>independently</strong> <span style=\"text-decoration: underline;\">then</span>.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"This is a header","font":{"bold":true,"size":18}}],"containers":[]},{"name":"paragraph","elementName":"Container","style":{"top":0,"left":0,"height":776,"width":752,"position":"relative"},"boxes":[],"containers":[{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":51,"width":747,"position":"relative"},"boxes":[{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Simple paragraphs","font":{"bold":true,"size":16}}],"containers":[]},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Left aligned","font":{"bold":true}}],"containers":[]},{"name":"centre","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":40,"left":0},"content":"<p style=\"text-align: center;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Centre aligned","font":{"bold":true}}],"containers":[]},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: right;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Right aligned","font":{"bold":true}}],"containers":[]},{"name":"justified","elementName":"Container","style":{"top":0,"left":0,"height":180,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: justify;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>"},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Justified aligned","font":{"bold":true}}],"containers":[]}]},{"name":"paragraphColumns","elementName":"Container","style":{"top":0,"left":0,"height":916,"width":751,"position":"relative"},"boxes":[],"containers":[{"name":"header","elementName":"Container","style":{"top":0,"left":0,"height":34,"width":746,"position":"relative"},"boxes":[{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Paragraph with columns","font":{"bold":true,"size":16}}],"containers":[],"startOnNewPage":true},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":204,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":3},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Left aligned","font":{"bold":true}}],"containers":[]},{"name":"centre","elementName":"Container","style":{"top":0,"left":0,"height":219,"width":740,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":40,"left":0},"content":"<p style=\"text-align: center;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":4},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Centre aligned","font":{"bold":true}}],"containers":[]},{"name":"left","elementName":"Container","style":{"top":0,"left":0,"height":205,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: right;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":2},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Right aligned","font":{"bold":true}}],"containers":[]},{"name":"justified","elementName":"Container","style":{"top":0,"left":0,"height":219,"width":743,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":38,"left":0},"content":"<p style=\"text-align: justify;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.</p>","columnCount":4},{"name":"TextBox","elementName":"TextBox","style":{"top":0,"left":0},"content":"Justified aligned","font":{"bold":true}}],"containers":[]}]}],"data":{}};
		return {schema:schema,data:schema.data || {}};	
	},
	componentDidMount() {
		;
		
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
		
		var schema = this.state.schema;
		if (schema === undefined) return (<div>Loading ...</div>);
		var dataContext = this.bindToState('data');
		return (
			<div>
				<div>
					<PDFPagesTrigger schema={schema} data={this.state.data}>
						<input type="button" value="PDF Kit" />
					</PDFPagesTrigger>
					<PDFPagesTrigger type='pdfHummus' schema={schema} data={this.state.data}>
						<input type="button" value="PDF Hummus" />
					</PDFPagesTrigger>
					<ModalTrigger modal={<MyModal schema={schema} dataContext={dataContext} />}>
						<input type="button" value="modal" />
					</ModalTrigger>
				</div>
				<HtmlPagesRenderer widgets={widgets} schema={schema} data={this.state.data} dataContext={dataContext} intlData={schema.intlData} errorFlag={true} pageOptions={{margin:{top:20, left: 20}}} />
			</div>
		)
	}
});

React.render(<App />, document.getElementById('app'));
