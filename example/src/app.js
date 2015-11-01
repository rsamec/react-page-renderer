import React from 'react';
import BindToMixin from 'react-binding';
import {HtmlPagesRenderer,HtmlBookRenderer,BindingUtil} from 'react-page-renderer';
import _ from 'lodash';
import request from 'superagent';
import falcor from 'falcor';
import falcorDataSource from 'falcor-http-datasource';

//widgets
import Core from 'react-designer-widgets';
import Shapes from 'react-shapes';
import Chart from 'react-pathjs-chart';


var Widgets = {

	'Core.TextBoxInput': Core.TextBoxInput,
	'Core.CheckBoxInput': Core.CheckBoxInput,
	'Core.SelectBoxInput': Core.SelectBoxInput,
	'Core.JSXBox': Core.JSXBox,
	'Core.TextBox': Core.TextBox,
	'Core.ValueBox': Core.ValueBox,
	'Core.HtmlBox': Core.HtmlBox,
	'Core.ImageBox': Core.ImageBox,
	'Core.ImagePanel': Core.ImagePanel,
	'Core.Flipper': Core.Flipper,
	'Core.TangleNumberText': Core.TangleNumberText,
	'Core.TangleBoolText': Core.TangleBoolText,

	'Shapes.Rectangle': Shapes.Rectangle,
	'Shapes.Ellipse': Shapes.Ellipse,
	'Shapes.Circle': Shapes.Circle,
	'Shapes.Line': Shapes.Line,
	'Shapes.Polyline': Shapes.Polyline,
	'Shapes.CornerBox': Shapes.CornerBox,
	'Shapes.Triangle':Shapes.Triangle,

	'Chart.Pie': Chart.Pie,
	'Chart.Bar': Chart.Bar,
	'Chart.SmoothLine': Chart.SmoothLine,
	'Chart.StockLine': Chart.StockLine,
	'Chart.Scatterplot': Chart.Scatterplot,
	'Chart.Radar': Chart.Radar,
	'Chart.Tree': Chart.Tree
};

//external widgets with more controls
import ReactBootstrap from 'react-bootstrap';

	_.each(['Input','Button', 'Panel','Glyphicon','Tooltip','Alert','Label'],function(widgetName){
		var name = 'ReactBootstrap.' + widgetName;
		Widgets[name] = ReactBootstrap[widgetName];
	});


//var nameStore = new DataStore();

var iterate = function (current,fce) {
    var children = current.containers;

    //iterate through containers
    var containers = [];
    for (var i = 0, len = children.length; i < len; i++) {
        fce.apply(this,[children[i]]);
		iterate(children[i],fce);
    }
};
var App = React.createClass({
	mixins:[BindToMixin],
	getInitialState(){
		var schema = undefined;
		return {
			schema:schema,
			data:schema && schema.defaultData || {},
			book:false
		};
	},
	bindToRepeater(schema,dataSources){

		const CONTAINER_NAME = "Container";
		const REPEATER_CONTAINER_NAME = "Repeater";


		var dataBinder = this.bindToState('data');
		if (dataBinder === undefined) return;

		if (dataSources == undefined) return;

		var self = this;

		//step -> set repeatable sections (containers) -
		iterate(schema, function (x) {
			if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
				var bindingProps = x.props && x.props.binding;


				var binding = self.bindTo(dataBinder, bindingProps.path);


				var pos = bindingProps.path.indexOf('.');
				if (pos === -1) return;

				//grab pathes
				var modelPath = bindingProps.path.substr(0, pos);
				var falcorPath = bindingProps.path.substr(pos + 1);

				if (dataSources[modelPath] === undefined) return;
				//var rangeFromPath = getArrayRange(falcorPath);
				//if (rangeFromPath === undefined) {

				if (falcorPath.indexOf('[') === -1) {
					console.log(falcorPath);
					dataSources[modelPath].getValue(falcorPath + '.length').then(function (response) {
						console.log(falcorPath + " = " + response);
						if (response !== undefined) binding.value = new Array(response);
					});
				}

			}
		});
	},

	componentDidMount() {
		request.get('mfcr_summary (5).json')
			.end(function(err, res){
				if (res.ok) {
					if (this.isMounted()) {
						//alert(JSON.stringify(res.body));
						var schema = res.body;
						var dataSources = _.reduce(schema.props.dataSources,function(memo,value,key){
							memo[key] = new falcor.Model({source: new falcorDataSource(value)});
							return memo;
						},{});

						this.setState({
							schema: schema,
							data:_.extend({dataSources:dataSources},schema.props.defaultData || {})
						});
						this.bindToRepeater(schema, dataSources);
					}
				} else {
					alert('Oh no! error ' + res.text);
				}
			}.bind(this));

		//var me = this;
		//nameStore.on( 'change:name', function( value ){
		//	me.setState( {name: value} );
		//});
        //
		////Let's update the name in 2 seconds
		//setTimeout( function(){
		//	flux.doAction( 'changeName', 'Bob' );
		//}, 2000);
	},
	render: function() {
		
		var schema = BindingUtil.bindToSchema(_.cloneDeep(this.state.schema),this.state.data);
		if (schema === undefined) return (<div>Loading ...</div>);
		//if (this.state.data === undefined) return (<div>Loading data ...</div>);
		var dataContext = this.bindToState('data');

		return (
			<div>
				<a onClick={()=>{this.setState({book:!this.state.book})}}>{this.state.book?"Sequence":"Book"}</a>
				<div>
				{!this.state.book? <HtmlPagesRenderer widgets={Widgets} schema={schema} data={this.state.data} dataContext={dataContext} pageOptions={{margin:{top:20, left: 20}}} />:null}
				{this.state.book?<HtmlBookRenderer widgets={Widgets} schema={schema} data={this.state.data} dataContext={dataContext} pageOptions={{margin:{top:20, left: 20}}} />:null}
				</div>
			</div>
		)
	}
});

React.render(<App />, document.getElementById('app'));
