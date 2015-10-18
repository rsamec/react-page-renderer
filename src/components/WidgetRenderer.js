import React from 'react';
import _ from 'lodash';
import BindToMixin from 'react-binding';
import Transmit from 'react-transmit';

var WidgetRenderer = React.createClass({
	mixins:[BindToMixin],
	getInitialState(){
		return {hasFetched:false}
	},
	applyBinding(widget,box,dataBinder,dataSources){

		var fragments = {};
		//go through all properties
		for (var propName in box) {
			var prop = box[propName];


			//TODO: find better way how to detect binding
			var field = widget.metaData && widget.metaData.settings && widget.metaData.settings.fields && widget.metaData.settings.fields[propName];
			var isBinding = field !== undefined && (field.type === 'bindingEditor' || field.type === 'bindingValueEditor');

			//if binding -> replace binding props
			if (isBinding) {

				if (prop === undefined) continue;
				
				//bind to const value
				if (prop.value !== undefined) {
					box[propName] = prop.value;
					continue;
				}


				var bindingProps = prop; //field.type === 'bindingEditor'?prop:prop.binding;
				if (_.isObject(bindingProps) && !!bindingProps.path) {


					//apply binding
					var converter;
					if (!!prop.converter && !!bindingProps.converter.compiled) {
						converter = eval(bindingProps.converter.compiled);
					}
					var binding = this.bindTo(dataBinder, bindingProps.path, converter);

					if (dataSources !==undefined){
						var pos = bindingProps.path.indexOf('.');
						if (pos === -1) continue;

						//grab pathes
						var modelPath = bindingProps.path.substr(0,pos);
						var falcorPath = bindingProps.path.substr(pos + 1);

						fragments[propName] = function(){ return dataSources[modelPath].get(falcorPath)};
						//remove
						delete box[propName];
						continue;
					}

					if (prop.mode === 'TwoWay') {
						//two-way binding
						if (this.props.designer!== true) box.valueLink = this.bindTo(dataBinder, bindingProps.path, converter);
						box[propName] = undefined;
					}
					else {
						//one-way binding
						//box[propName] = dataBinder.value[prop.Path];
						box[propName] = binding.value;

					}
				}
				else {
					//binding is not correctly set - do not apply binding
					box[propName] = undefined;
				}
			}
		}
		return fragments;
	},
	render(){
		const {designer} = this.props;
		var box = this.props.node;
		var widget  = this.props.widget;
		if (widget === undefined) {
			return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
		}

		var customStyle= this.props.customStyle;

		//apply property resolution strategy -> default style -> custom style -> local style
		var widgetStyle = _.cloneDeep(widget.metaData && widget.metaData.props || {});
		if (customStyle !== undefined) widgetStyle = _.merge(widgetStyle,customStyle);
		var props = _.merge(widgetStyle,box.props);

		var fragments;
		if (this.props.dataBinder !== undefined) fragments=this.applyBinding(widget,props,this.props.dataBinder,this.bindTo(this.props.dataBinder, "dataSources").value);

		if (designer !==true && _.keys(fragments).length !==0) widget = Transmit.createContainer(widget,{fragments: fragments});
		return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({dangerouslySetInnerHTML: {__html: props.content}}) : null);


		//return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({dangerouslySetInnerHTML: {__html: props.content}}) : null);

	}
});
export default  WidgetRenderer;
//WidgetRenderer.propTypes = { widget:  React.PropTypes.node, value:React.PropTypes.object,dataBinder:React.PropTypes.object };
