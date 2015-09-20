import React from 'react';
import BindToMixin from 'react-binding';
import {HtmlPagesRenderer,HtmlBookRenderer,DataStore} from 'react-page-renderer';
import _ from 'lodash';
import request from 'superagent';

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
	'Chart.Tree': Chart.Tree,
};

//external widgets with more controls
import ReactBootstrap from 'react-bootstrap';

	_.each(['Input','Button', 'Panel','Glyphicon','Tooltip','Alert','Label'],function(widgetName){
		var name = 'ReactBootstrap.' + widgetName;
		Widgets[name] = ReactBootstrap[widgetName];
	});


//var nameStore = new DataStore();

var App = React.createClass({
	mixins:[BindToMixin],
	getInitialState(){
		var schema = undefined;
		return {schema:schema,data:schema && schema.defaultData || {}};	
	},
	componentDidMount() {
		request.get('Chart_pie.json')
			.end(function(err, res){
				if (res.ok) {
					if (this.isMounted()) {
						//alert(JSON.stringify(res.body));
						var schema = res.body;
						this.setState({
							schema: schema,
							data:schema.props.defaultData || {}
						});
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
		
		var schema = this.state.schema;
		if (schema === undefined) return (<div>Loading ...</div>);
		if (this.state.data === undefined) return (<div>Loading data ...</div>);
		var dataContext = this.bindToState('data');
		return (
			<div> 	
				<HtmlPagesRenderer widgets={Widgets} schema={schema} data={this.state.data} dataContext={dataContext} intlData={schema.intlData} errorFlag={true} pageOptions={{margin:{top:20, left: 20}}} />
			</div>
		)
	}
});

React.render(<App />, document.getElementById('app'));
