react-page-renderer
=======================

It renders pages according to print object schema.


## Demo & Examples

Live demo: __LINK TO LIVE DEMO__

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use My-Component is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/my-component.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-page-renderer --save
```


## Usage

```
HtmlPagesRenderer = require('react-page-renderer');

<HtmlPagesRenderer widgets={widgets} schema={schema} data={schema.data} />
```

### Properties

+	widgets - the list of widgets used for rendering
+	schema - print object schema
+	data - data used to data bind values to schemas

```
var WidgetFactory = require('react-designer-widgets');
var widgets = new WidgetFactory().getWidgets();
```

### Notes

