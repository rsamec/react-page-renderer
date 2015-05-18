import React from 'react';

import BootstrapRenderer from './BootstrapRenderer.js';
//binding
import BindToMixin from 'react-binding';
//business-rules-engine
import FormSchema from 'business-rules-engine/commonjs/FormSchema';
import Utils from 'business-rules-engine/commonjs/Utils';

var BootstrapPublisher = React.createClass({
	mixins:[BindToMixin],
	getInitialState() {
		return {
			rules: new FormSchema.JsonSchemaRuleFactory(this.props.rules).CreateRule("Main")
		};
	},
	result(){
		if (this.state.rules === undefined) return {Errors:{}};
		return Utils.CompositeDotObject.Transform(this.state.rules.Validate(this.props.dataContext.value)).Main;
	},
	render() {
		var style = {position: 'absolute', width: '100%'};
		return (
				<div style={style}>
					<BootstrapRenderer widgets={this.props.widgets} dataContext={this.props.dataContext} errors={this.result()} schema={this.props.schema}/>
				</div>
		);
	}
});

export default BootstrapPublisher;
