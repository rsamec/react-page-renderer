var React = require('react');
var traverse = require('traverse');
var _ = require('underscore');

import BindToMixin from 'react-binding';

var BootstrapRenderer = React.createClass({
	mixins:[BindToMixin],

	transformToBoxes:function(objectSchema){
		//visible
		var clone = traverse(objectSchema).map(function (x) {
			return x;
		});

		//transform from relative to absolute
		var containers = traverse(clone).map(function (x) {
			if (this.key === "containers"){
				var heigth =0;
				for (var i in x){
					var container = x[i];
					container.style.top = heigth;
					var tempHeight =parseInt(container.style.height,10);
					heigth +=  tempHeight!==undefined?tempHeight:0;
				}
			}
			return x;
		});
		//reduce to boxes
		var boxes = [];
		var pages = traverse(containers).reduce(function (occ,x) {
			//if (this.key === "containers") return this.node.boxes;

			if (this.key === "boxes"){
				var parent = this.parent.node;
				//console.log("style:" + node.style.top + " " + node.style.height + " " + node.style.left + " " + node.style.width);

				for (var i in x){
					var el = x[i];
					var top = parseInt(parent.style.top,10) + parseInt(el.style.top,10);
					var left = parseInt(parent.style.left,10) + parseInt(el.style.left,10);
					var height = parseInt(el.style.height,10);
					var width = parseInt(el.style.width,10);
					if (isNaN(height)) height = 0;
					if (isNaN(width)) width = 0;

					// set another text box
					boxes.push({element:x[i],style:{'left':left,'top':top, 'position':'absolute'}});
				}
			}
			return occ;
		}, boxes);
		return boxes;
	},
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
				if (prop.Mode === "TwoWay") {
					//two-way binding
					box.valueLink = this.bindTo(dataContext, prop.Path);
					box.value = undefined;
					
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

		var props = _.omit(box,'style');
		return React.createElement(widget,props, box.content!== undefined?React.DOM.span(null, box.content):undefined);

	},
	render: function () {
		var style={height:'100%', width:'100%'};
		var boxes = this.transformToBoxes(this.props.schema);
		return (
			<div style={style}>
				<div>
                {boxes.map(function (node, i) {
					var element = node.element;
					var style = node.style;
					var component = this.createComponent(element);
					return (
						<div style={style}>
                            {component}
						</div>
					);
				}, this)}
				</div>
			</div>
		);
	}
});

module.exports = BootstrapRenderer;
