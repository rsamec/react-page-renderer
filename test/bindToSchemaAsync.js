var expect1 = require('expect.js');
var falcor = require('falcor');
var _ = require('lodash');
var jasmine = require('jasmine');
var bindToSchema = require('../lib/utilities/bindToSchema');
var bindToSchemaAsync = require('../lib/utilities/bindToSchemaAsync');

var logError = function(done){
    return function(error) {
        console.log(error);
        done();
    }
};

jasmine.defaultTimeoutInterval = 10000;
//jasmine.getEnv().defaultTimeoutInterval = timeoutYouWouldPrefe
//var pptDocument = {"elementName":"ObjectSchema","name":"invoice","containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":659,"width":734,"position":"relative"},"props":{"startOnNewPage":false,"unbreakable":false},"boxes":[],"containers":[{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":42,"width":726,"position":"relative"},"props":{"startOnNewPage":false,"unbreakable":false},"boxes":[{"name":"TangleBoolText","elementName":"Core.TangleBoolText","style":{"top":0,"left":0},"props":{"value":{"path":"showInvoice2"},"trueText":"zobrazit detail","falseText":"skrýt detail"}},{"name":"ValueBox","elementName":"Core.ValueBox","style":{"left":140,"transform":{}},"props":{"content":{"path":"mfcr.summary.year2015[2].dodavatel","mode":"OneWay"}}}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":122,"width":728,"position":"relative"},"props":{"visibility":{"path":"showInvoice","mode":"OneWay"},"startOnNewPage":false,"unbreakable":false},"boxes":[{"name":"HtmlBox","elementName":"Core.HtmlBox","style":{"top":0,"left":0,"transform":{}},"props":{"content":"<p><strong>Arial</strong></p>\n<p>Arial is an extremely versatile family of typefaces which can be used with equal success for text setting in reports, presentations, magazines etc, and for display use in newspapers, advertising and promotions.</p>"}}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":196,"width":725,"position":"relative"},"props":{"visibility":{"path":"showInvoice2","mode":"OneWay"},"startOnNewPage":false,"unbreakable":false},"boxes":[{"name":"ValueBox","elementName":"Core.ValueBox","style":{"top":0,"left":0},"props":{"content":{"path":"mfcr.summary.year2015[0].dodavatel","mode":"OneWay"}}}],"containers":[]}]}],"data":{},"props":{"defaultData":{"showInvoice2":false},"dataSources":{"model":"http://localhost:3000/model.json","mfcr":"http://localhost:3000/mfcr.json"},"context":{}}}
//var pptDocument = {"elementName":"ObjectSchema","name":"mfcr_summary","containers":[{"name":"Copy container","elementName":"Container","style":{"top":0,"left":0,"height":782,"width":738,"position":"relative"},"props":{"startOnNewPage":false,"unbreakable":false},"boxes":[{"name":"Pie","elementName":"Chart.Pie","style":{"top":0,"left":0,"transform":{}},"props":{"data":{"path":"mfcr.summary.year2015[5..15]['dodavatel','price']","converter":{"code":"return {\n\tformat:function(value){\n      var result = _lodash.map(value,function(item){return {name:item.dodavatel,price:item.price}});\n      return result;\n\t}\n}","compiled":"\"use strict\";\n\n(function () {\n     return {\n          format: function format(value) {\n               var result = _lodash.map(value, function (item) {\n                    return { name: item.dodavatel, price: item.price };\n               });\n               return result;\n          }\n     };\n})();"},"mode":"OneWay"},"accessorKey":"price","options":{"margin":{},"width":700,"height":700,"color":"#7e70cf","r":300,"R":80,"legendPosition":"topLeft","animate":{},"label":{"fontSize":16,"color":"#f20a0a"}}}}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":47,"width":737,"position":"relative"},"props":{"startOnNewPage":false,"unbreakable":false},"boxes":[{"name":"TangleBoolText","elementName":"Core.TangleBoolText","style":{"top":0,"left":2},"props":{"value":{"path":"showVypis"},"trueText":"Zobrazit výpis","falseText":"Skrýt výpis"}}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":82,"width":736,"position":"relative"},"props":{"visibility":{"path":"showVypis","mode":"OneWay"},"startOnNewPage":false,"unbreakable":true},"boxes":[],"containers":[{"name":"container","elementName":"Repeater","style":{"top":0,"left":0,"width":735,"height":48,"position":"relative"},"props":{"binding":{"path":"mfcr.summary.year2015[5..50]","mode":"OneWay"},"startOnNewPage":false,"unbreakable":true},"boxes":[{"name":"ValueBox","elementName":"Core.ValueBox","style":{"top":0,"left":0,"width":200,"transform":{}},"props":{"content":{"path":"dodavatel","mode":"OneWay"}}},{"name":"Copy ValueBox","elementName":"Core.ValueBox","style":{"top":-2,"left":223,"width":300,"transform":{}},"props":{"content":{"path":"cena","mode":"OneWay"}}},{"name":"Copy Copy ValueBox","elementName":"Core.ValueBox","style":{"top":1,"left":629,"transform":{}},"props":{"content":{"path":"qt","mode":"OneWay"}}}],"containers":[]}]}],"data":{},"props":{"defaultData":{"firstName":"karel","Úèel platby":"hotove"},"dataSources":{"model":"http://localhost:3000/model.json","mfcr":"http://localhost:3000/mfcr.json"},"context":{}}};
var pptDocument = {"elementName":"ObjectSchema","name":"mfcr_summary","containers":[{"name":"Copy container","elementName":"Container","style":{"top":0,"left":0,"height":782,"width":738,"position":"relative"},"props":{"startOnNewPage":false,"unbreakable":false},"boxes":[{"name":"Pie","elementName":"Chart.Pie","style":{"top":0,"left":0,"transform":{}},"props":{"data":{"path":"mfcr.summary.year2015[5..15]['dodavatel','price']","converter":{"code":"return {\n\tformat:function(value){\n      var result = _lodash.map(value,function(item){return {name:item.dodavatel,price:item.price}});\n      return result;\n\t}\n}","compiled":"\"use strict\";\n\n(function () {\n     return {\n          format: function format(value) {\n               var result = _lodash.map(value, function (item) {\n                    return { name: item.dodavatel, price: item.price };\n               });\n               return result;\n          }\n     };\n})();"},"mode":"OneWay"},"accessorKey":"price","options":{"margin":{},"width":700,"height":700,"color":"#7e70cf","r":300,"R":80,"legendPosition":"topLeft","animate":{},"label":{"fontSize":16,"color":"#f20a0a"}}}}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":47,"width":737,"position":"relative"},"props":{"startOnNewPage":false,"unbreakable":false},"boxes":[{"name":"TangleBoolText","elementName":"Core.TangleBoolText","style":{"top":0,"left":2},"props":{"value":{"path":"showVypis"},"trueText":"Zobrazit výpis","falseText":"Skrýt výpis"}}],"containers":[]},{"name":"container","elementName":"Container","style":{"top":0,"left":0,"height":58,"width":740,"position":"relative"},"props":{"visibility":{"path":"showVypis","mode":"OneWay"},"startOnNewPage":false,"unbreakable":true},"boxes":[],"containers":[{"name":"container","elementName":"Repeater","style":{"top":0,"left":0,"width":735,"height":48,"position":"relative"},"props":{"binding":{"path":"mfcr.summary.year2015[5..7]","mode":"OneWay"},"startOnNewPage":false,"unbreakable":true},"boxes":[{"name":"ValueBox","elementName":"Core.ValueBox","style":{"top":0,"left":0,"width":200,"transform":{}},"props":{"content":{"path":"dodavatel","mode":"OneWay"}}},{"name":"Copy ValueBox","elementName":"Core.ValueBox","style":{"top":-2,"left":223,"width":300,"transform":{}},"props":{"content":{"path":"cena","mode":"OneWay"}}},{"name":"Copy Copy ValueBox","elementName":"Core.ValueBox","style":{"top":1,"left":629,"transform":{}},"props":{"content":{"path":"qt","mode":"OneWay"}}}],"containers":[]}]},{"name":"Copy container","elementName":"Container","style":{"top":0,"left":0,"height":58,"width":740,"position":"relative"},"props":{"visibility":{"path":"showVypis","mode":"OneWay"},"startOnNewPage":false,"unbreakable":true},"boxes":[],"containers":[{"name":"container","elementName":"Repeater","style":{"top":0,"left":0,"width":735,"height":48,"position":"relative"},"props":{"binding":{"path":"mfcr.summary.year2015","mode":"OneWay"},"startOnNewPage":false,"unbreakable":true},"boxes":[{"name":"ValueBox","elementName":"Core.ValueBox","style":{"top":0,"left":0,"width":200,"transform":{}},"props":{"content":{"path":"dodavatel","mode":"OneWay"}}},{"name":"Copy ValueBox","elementName":"Core.ValueBox","style":{"top":-2,"left":223,"width":300,"transform":{}},"props":{"content":{"path":"cena","mode":"OneWay"}}},{"name":"Copy Copy ValueBox","elementName":"Core.ValueBox","style":{"top":1,"left":629,"transform":{}},"props":{"content":{"path":"qt","mode":"OneWay"}}}],"containers":[]}]}],"data":{},"props":{"defaultData":{"firstName":"karel","Úèel platby":"hotove"},"dataSources":{"model":"http://localhost:3000/model.json","mfcr":"http://localhost:3000/mfcr.json"},"context":{}}};
describe('DataBinding', function () {


    describe('bind to schema', function () {

        //it('sync', function () {
        //    var schema = bindToSchema(pptDocument, {});
        //    //console.log(JSON.stringify(schema,null,2));
        //    expect1(schema).to.equal(schema);
        //},10000);

        it('async', function (done) {
            bindToSchemaAsync(pptDocument, {}).then(function (result) {

                //expect1(value).to.equal(initValues.firstName);
                console.log(JSON.stringify(result,null,2));
                done();

            }, logError(done))
        },10000);
    });

    //var initValues = {firstName: "Roman", lastName: "Samec", email: "email"};
    //var changedValues = {firstName: "Roman changed", lastName: "Samec changed", email: "email changed"};
    //
    //
    //describe('bind to properties by path', function () {
    //    //when
    //    var model = new falcor.Model({
    //        cache: {
    //            Data: {
    //                "Person": {
    //                    "FirstName": initValues.firstName,
    //                    "LastName": initValues.lastName,
    //                    "Contact": {
    //                        "Email": initValues.email
    //                    }
    //                }
    //            }
    //        }
    //    });
    //    it('Data.Person.FirstName', function (done) {
    //        //verify pathes
    //        model.getValue("Data.Person.FirstName").subscribe(function (value) {
    //
    //            expect1(value).to.equal(initValues.firstName);
    //            done();
    //
    //        }, logError(done))
    //    });
    //    it('Data.Person.LastName', function (done) {
    //        //verify pathes
    //        model.getValue("Data.Person.LastName").subscribe(function (value) {
    //
    //            expect1(value).to.equal(initValues.lastName);
    //            done();
    //
    //        }, logError(done))
    //    });
    //    it('Data.Person.Contact.Email', function (done) {
    //        //verify pathes
    //        model.getValue("Data.Person.Contact.Email").subscribe(function (value) {
    //
    //            expect1(value).to.equal(initValues.email);
    //
    //            done();
    //
    //        }, logError(done))
    //    });
    //});
});