import React from 'react';
import BindToMixin from 'react-binding';
import {HtmlPagesRenderer,HtmlBookRenderer,BindingUtil,GraphicUtil} from 'react-page-renderer';
import _ from 'lodash';
import request from 'superagent';
import falcor from 'falcor';
import falcorDataSource from 'falcor-http-datasource';
import Transmit from 'react-transmit';
var joyride = require('react-joyride').Mixin;

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
    'Core.ImageCarousel': Core.ImageCarousel,
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

//external widgets with more controls
import {Navbar,NavBrand,Nav,NavItem} from 'react-bootstrap';


var ReactBootstrap = require('react-bootstrap');
_.each(['Input', 'Button', 'Panel', 'Glyphicon', 'Tooltip', 'Alert', 'Label'], function (widgetName) {
    var name = 'react-bootstrap.' + widgetName;
    Widgets[name] = ReactBootstrap[widgetName];
});
var bootstrapSettings = {};
_.extend(Widgets['react-bootstrap.Button'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});
_.extend(Widgets['react-bootstrap.Label'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Panel'], {
    metaData: {
        props: {
            header:"Header",bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Glyphicon'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', glyph: 'star'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Alert'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Well'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Input'], {
    metaData: {
        props: {
            type: 'text',placeholder:'type your text', label:'label', help:'',value:''
        },
        settings:bootstrapSettings
    }
});
_.extend(Widgets['react-griddle'], {
    metaData: {
        props: {
            results: undefined,
            columns:undefined,
            columnMetadata:undefined,
            noDataMessage:undefined,
            resultsPerPage:undefined,
            showSettings:false,
            showFilter:false,
            showPager:true,
            showTableHeading:true

        },
        settings: {
            fields:{
                //content:{type:'string'},
                results:{type:'bindingEditor'},
                showSettings:{type:'boolean'},
                showFilter:{type:'boolean'},
                showTableHeading:{type:'boolean'},
                showPager:{type:'boolean'},
                columnMetadata:{type:'plainJsonEditor'},
                columns:{type:'jsonEditor'},
                resultsPerPage:{type:'number'}

            }
        }
    }
});

//var nameStore = new DataStore();

var iterate = function (current, fce) {
    var children = current.containers;

    //iterate through containers
    var containers = [];
    for (var i = 0, len = children.length; i < len; i++) {
        fce.apply(this, [children[i]]);
        iterate(children[i], fce);
    }
};
var App = React.createClass({
    mixins: [BindToMixin,joyride],
    getInitialState(){
        return {
            book: false
        };
    },
    bindToRepeater(schema, dataSources){

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
        this.loadSchema('Tasks.json');
    },
    loadSchema(schemaName){
        request.get(schemaName)
            .end(function (err, res) {
                if (res.ok && !!res.body) {

                    var schema = res.body;

                    var dataSources = _.reduce(schema.props.dataSources, function (memo, value, key) {
                        memo[key] = new falcor.Model({source: new falcorDataSource(value,{
                            crossDomain: true,
                            withCredentials: false
                        })});
                        return memo;
                    }, {});

                    this.setState({
                        schema: schema,
                        data: _.extend({dataSources: dataSources}, schema.props.defaultData || {}),
                        format: schema.props.defaultPageSize || 'A4'
                    });
                    this.bindToRepeater(schema, dataSources);
                    this.restartGuide(schema.props.tour);


                } else {
                    alert('Oh no! error ' + res.text);
                }
            }.bind(this));
    },

    restartGuide(){
        //var schema = this.state.schema;
        //var tour = schema.props.tour;
        //if (tour !== undefined && _.isArray(tour) && tour.length !==0) {
        //    this.joyrideReplaceSteps(tour,true);
        //    this.joyrideStart()
        //}
        //else{
        //    this.joyrideReplaceSteps([]);
        //}
    },
    componentWillMount: function () {
        this.joyrideSetOptions({
            //locale: {
            //    back: 'Zpìt',
            //    close: 'Zavøít',
            //    last: 'Poslední',
            //    next: 'Další',
            //    skip: 'Pøeskoèit'
            //},
            showSkipButton: true,
            //tooltipOffset: 10,

            stepCallback: function (step) {
                console.log(step);
            }

            ,
            completeCallback: function (steps) {
                console.log(steps);
            }
        });
    },

    setFormat(index){
        this.setState({format:'A' + index});
    },
    generate(type){

        var contentType = 'image/' + type;
        if (type === "pdf") contentType = 'application/pdf';
        var url = 'http://render-pergamon.rhcloud.com';
        //var url = 'http://localhost:8080';
        //var name = this.context.router.getCurrentParams().name;

        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", url + '/' + type);

        //xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.responseType = 'arraybuffer';

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var blob = new Blob([xmlhttp.response], {type: contentType});
                var fileURL = URL.createObjectURL(blob);
                window.open(fileURL);
            }
        };

        xmlhttp.send(JSON.stringify(_.extend(this.state.schema,{
            data:this.state.data,
            pageOptions:this.getPageOptions()
        })));
    },
    getPageOptions(){
        var pageSize = GraphicUtil.PageSizes[this.state.format.toUpperCase()];
       return {width:pageSize[0], height:pageSize[1], margin:{top:20, left: 20,bottom:20}};
    },
    render: function () {

        var schema = BindingUtil.bindToSchema(_.cloneDeep(this.state.schema), this.state.data);
        if (schema === undefined) return (<div>Loading ...</div>);
        //if (this.state.data === undefined) return (<div>Loading data ...</div>);
        var dataContext = this.bindToState('data');
        var pageOptions = this.getPageOptions();
        var formats = _.range(0,10);
        return (
            <div>
                <Navbar toggleNavKey={0}>
                    <Nav navbar>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                <span>Guides</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a onClick={()=>{this.loadSchema('bikery.json')}}>Bike biomechanic</a></li>
                                <li><a onClick={()=>{this.loadSchema('DesignerWhitePaper.json')}}>React designer</a></li>
                                <li><a onClick={()=>{this.loadSchema('Flowers.json')}}>Flowers</a></li>
                                <li><a onClick={()=>{this.loadSchema('Tasks.json')}}>Tasks</a></li>
                                <li><a onClick={()=>{this.loadSchema('Orders.json')}}>Orders</a></li>
                                <li><a onClick={()=>{this.loadSchema('Invoice.json')}}>Invoices</a></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                <span>Texts</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a onClick={()=>{this.loadSchema('TextFormats.json')}}>Formats</a></li>
                                <li><a onClick={()=>{this.loadSchema('repeatPara.json')}}>Paragraphs</a></li>
                                <li><a onClick={()=>{this.loadSchema('Lists.json')}}>Lists</a></li>
                                <li><a onClick={()=>{this.loadSchema('TextColumns.json')}}>Multiple columns</a></li>
                                <li role="separator" className="divider"></li>
                                <li><a onClick={()=>{this.loadSchema('Contracty.json')}}>Mixed texts</a></li>
                            </ul>
                        </li>
                        <NavItem eventKey={1} onClick={() => this.loadSchema('Charts_pages.json')}>Charts</NavItem>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                <span>Images</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a onClick={()=>{this.loadSchema('Images.json')}}>Images</a></li>
                                <li><a onClick={()=>{this.loadSchema('ImageGallery.json')}}>Image gallery</a></li>
                            </ul>
                        </li>
                    </Nav>
                    <Nav navbar right>
                        <NavItem eventKey={1} onClick={()=>{this.generate("pdf")}}><span className="glyphicon glyphicon-print" title="generate pdf"></span></NavItem>
                        <NavItem eventKey={1} onClick={()=>{this.generate("png")}}><span className="glyphicon glyphicon-export" title="generate pdf"></span></NavItem>
                        <NavItem eventKey={3} onClick={()=>{this.restartGuide()}}><span className="glyphicon glyphicon-play-circle" title="start guide"></span></NavItem>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                <span>Page size</span>
                            </a>
                            <ul className="dropdown-menu">
                                {formats.map(function (item, index) {
                                        return (<li><a onClick={this.setFormat.bind(this,index)}>A{index}</a></li>);
                                    },this)}
                                <li role="separator" className="divider"></li>
                                <li><a onClick={()=>{this.setState({format:'Tabloid'})}}>Tabloid</a></li>
                                <li><a onClick={()=>{this.setState({format:'Letter'})}}>Letter</a></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                <span className="glyphicon glyphicon-menu-hamburger" title="actions"></span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a onClick={()=>{this.setState({book:false})}}>Page sequence</a></li>
                                <li><a onClick={()=>{this.setState({book:true})}}>Book viewer</a></li>
                            </ul>
                        </li>
                    </Nav>
                </Navbar>

                <div>

                    {!this.state.book ? <HtmlPagesRenderer widgets={Widgets} schema={schema} data={this.state.data}
                                                           dataContext={dataContext}
                                                           pageOptions={pageOptions} asyncRenderer={Transmit} /> : null}
                    {this.state.book ? <HtmlBookRenderer widgets={Widgets} schema={schema} data={this.state.data}
                                                         dataContext={dataContext}
                                                         pageOptions={pageOptions} asyncRenderer={Transmit} /> : null}
                </div>
            </div>
        )
    }
});

React.render(<App />, document.getElementById('app'));
