react-page-renderer
=======================

It generates pages for document according to [PTT](https://github.com/rsamec/ptt) and renders [react components](https://facebook.github.io/react/) to HTML.

+	__HtmlPagesRenderer__ - pages are displayed in continuous sequence
+	__HtmlBookRenderer__ - pages are book view using [turn](http://www.turnjs.com/)



## Demo & Examples

[Live demo](http://rsamec.github.io/react-page-renderer)

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-page-renderer is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-page-renderer.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-page-renderer --save
```


## Usage

```
var React = require('react');

var HtmlPagesRenderer = require('react-page-renderer').HtmlPagesRenderer;
var PDFPagesTrigger = require('react-page-renderer').PDFPagesTrigger;

//widgets
import Core from 'react-designer-widgets';
import Shapes from 'react-shapes';
import Chart from 'react-pathjs-chart';
import Griddle from 'griddle-react';

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
    'Shapes.Triangle': Shapes.Triangle,
    'Shapes.Dimension': Shapes.Dimension,

    'Chart.Pie': Chart.Pie,
    'Chart.Bar': Chart.Bar,
    'Chart.SmoothLine': Chart.SmoothLine,
    'Chart.StockLine': Chart.StockLine,
    'Chart.Scatterplot': Chart.Scatterplot,
    'Chart.Radar': Chart.Radar,
    'Chart.Tree': Chart.Tree,

    'react-griddle':Griddle
};

var App = React.createClass({
	getInitialState(){
		return {data:this.props.schema.data || {}}	
	},
	getDefaultProps(){
		var visibility = {"elementName":"ObjectSchema","name":"rootContainer","containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":109,"width":700,"position":"relative"},"boxes":[{"name":"CheckBoxInput","elementName":"CheckBoxInput","style":{"top":13,"left":11},"label":"Conditon 1","Binding":"ShowSection1"},{"name":"Copy CheckBoxInput","elementName":"CheckBoxInput","style":{"top":16,"left":135},"label":"Conditon 2","Binding":"ShowSection2"}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":270,"width":746,"position":"relative"},"boxes":[],"containers":[{"name":"first","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 1 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection1"}},{"name":"second","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}},{"name":"third","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 2 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection2"}},{"name":"fourt","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}}]},{"name":"Copy container","elementName":"Container","style":{"top":0,"left":0,"height":270,"width":746,"position":"relative"},"boxes":[],"containers":[{"name":"first","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 1 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection1"}},{"name":"second","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}},{"name":"third","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 2 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection2"}},{"name":"fourt","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}}]},{"name":"Copy Copy container","elementName":"Container","style":{"top":0,"left":0,"height":270,"width":746,"position":"relative"},"boxes":[],"containers":[{"name":"first","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 1 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection1"}},{"name":"second","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}},{"name":"third","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 2 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection2"}},{"name":"fourt","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}}]},{"name":"Copy Copy Copy container","elementName":"Container","style":{"top":0,"left":0,"height":270,"width":746,"position":"relative"},"boxes":[],"containers":[{"name":"first","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 1 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection1"}},{"name":"second","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}},{"name":"third","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>visible only if&nbsp;condition 2 is met.</strong></p>"}],"containers":[],"Visibility":{"Path":"ShowSection2"}},{"name":"fourt","elementName":"Container","style":{"top":0,"left":0,"height":68,"width":695,"position":"relative"},"boxes":[{"name":"HtmlBox","elementName":"HtmlBox","style":{"top":10,"left":-5},"content":"<p>This section should be <strong>always&nbsp;visible.</strong></p>"}],"containers":[],"Visibility":{}}]}],"data":{}};
		return {schema:visibility}	
	},
	render: function() {
		var schema = this.props.schema;
		return (
			<HtmlPagesRenderer widgets={Widgets} schema={schema} data={this.state.data} pageOptions={{margin:{top:20, left: 20}}} />
		)
	}
});

React.render(<App />, document.getElementById('app'));

```

### Properties

__HtmlPagesRenderer__

+	widgets - the list of widgets used for rendering
+	schema - document to print - [PTT](https://github.com/rsamec/ptt) format
+	data - data used to data bind values to schemas
+	pageOptions - height and width of the page , margin of the page

__HtmlBookRenderer__

+	widgets - the list of widgets used for rendering
+	schema - document to print - [PTT](https://github.com/rsamec/ptt) format
+	data - data used to data bind values to schemas
+	pageOptions - height and width of the page , margin of the page

### Notes

