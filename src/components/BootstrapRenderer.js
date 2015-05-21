var React = require('react');
var traverse = require('traverse');
var _ = require('underscore');

import deepClone from '../utilities/deepClone.js';
import BindToMixin from 'react-binding';

var Container = React.createClass({
	mixins:[BindToMixin],
	applyBinding:function(box){
		var dataContext = this.props.dataContext;
		var ref = function (obj, str) {
			return str.split(".").reduce(function(o, x) { return o === undefined?undefined:o[x] }, obj);
		}
		//apply binding
		for (var propName in box){
			var prop = box[propName];
			//TODO: better test - it is a binding object?
			if (_.isObject(prop) && !!prop.Path){
				if (propName === 'onAdd') {
					var selfBinding = this.bindArrayTo(dataContext,prop.Path);
					box.onClick = function(e){ selfBinding.add()}
				}
				else if (propName === 'onRemove'){
					var selfBinding = this.props.arrayContext;
					box.onClick = function(e){  selfBinding.remove(dataContext.value);}
				}
				else if (prop.Mode === "TwoWay") {
					//two-way binding
					box.valueLink = this.bindTo(dataContext, prop.Path);
					//box.value = undefined;
					
					//error - one way binding
					var error = ref(this.props.errors,prop.Path);
					if (error !== undefined) {
						box.help = error.ErrorMessage;
						box.bsStyle = error.HasErrors ? 'error' : '';
					}
				}
				else{
					//one-way binding
					box[propName] = this.bindTo(dataContext, prop.Path).value;
				}
			}
		}
		
	},
	createComponent: function (box) {

		var widget =this.props.widgets[box.elementName];
		if (widget === undefined){
			return React.DOM.span(null,"Component '" + box.elementName + "' is not register among widgets.")
		}

		this.applyBinding(box);

		var props = _.omit(box,['style','value']);
		return React.createElement(widget,props, box.content!== undefined?React.DOM.span(null, box.content):undefined);

	},
	render: function () {

		var containers = this.props.containers || [];
		var boxes = this.props.boxes || [];
		
		var styles = {
			left: this.props.left,
			top: this.props.top,
			height: this.props.height,
			width: this.props.width,
			position: this.props.position
		};
		var widgets = this.props.widgets;
		var dataContext = this.props.dataContext;
		var errors = this.props.errors;
		
		return (
			<div className='cContainer' style={styles}>
             {containers.map(function (container, index) {
				 var repeats =[{c:container,d:dataContext,e:errors}];
				 if (container.elementName === "Repeater") {
					 var arrayContext = this.bindArrayTo(dataContext, container.Binding.Path);
					 var arrayErrors;
					 if (errors[container.Binding.Path]!== undefined) arrayErrors = errors[container.Binding.Path].Children;
					 
					 var items = arrayContext.items;
				
					 	 repeats = items.length !== 0 ? _.map(items, function (item,index) {
						 return {c: deepClone(container), d: item,e:arrayErrors!==undefined?arrayErrors[index]:undefined, arrayContext:arrayContext};
					 }, this) : [];
				 };
				 
				 return (<div>
				 {repeats.map(function (obj, index) {
					 var c = obj.c;
					 var key = c.name + index;

					 var left = c.style.left === undefined ? 0 : parseInt(c.style.left, 10);
					 var top = c.style.top === undefined ? 0 : parseInt(c.style.top, 10);

					 return (
						 <Container key={key}
							 left={left}
							 top={top}
							 height={c.style.height}
							 width={c.style.width}
							 position={c.style.position}
							 boxes={c.boxes}
							 containers={c.containers}
							 widgets={widgets}
							 errors={obj.e}
							 dataContext={obj.d}
							 arrayContext={obj.arrayContext}
							 
						 />
					 )
				 })
					 }
				 </div>)
			 }, this)
				 }
                {boxes.map(function (box, index) {

				
					var key = box.name + index;


					var boxComponent = this.createComponent(box, key);
					var left = box.style.left === undefined ? 0 : parseInt(box.style.left, 10);
					var top = box.style.top === undefined ? 0 : parseInt(box.style.top, 10);
					var boxStyle = {top:top,left:left};
					return (
						<div className='cBox' style={boxStyle}>
                                {boxComponent}
						</div>
					);
				}, this)
					}
			</div>
		);
	}
});
var BootstrapRenderer = React.createClass({
	mixins:[BindToMixin],
	render(){
		return (<Container
			containers={this.props.schema.containers}
			boxes={this.props.schema.boxes}
			isRoot={true}
			widgets={this.props.widgets}
			dataContext={this.props.dataContext}
			errors={this.props.errors}
		/>)
	}
});

module.exports = BootstrapRenderer;
