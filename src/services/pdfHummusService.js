'use strict';

import request from 'superagent';
import _ from 'underscore';

export default class pdfKitService {
	constructor(url) {
		this.url = url || 'http://pdfrendering.herokuapp.com';
	}

	transformToPdfDocument(pages) {
		var pdf = {
			pages: []
		};

		// add new page
		var defaultFontOptions = {
			"fontPath": "./resources/fonts/arial.ttf",
			"size": 10,
			"color": "black"
		};
		var rectOptions = {
			"type": "stroke",
			"color": "gray"
		};


		var mapFontName = function (font) {
			if (font === undefined) return "arial";
			if (font.bold && font.italic) return "arialbi";
			if (font.bold) return "arial";
			if (font.italic) return "ariali";
			return "arial"
		};
		var mapFontOptions = function (font) {

			if (font === undefined) return defaultFontOptions;

			var color = defaultFontOptions.color;
			if (!!font.color) {
				color = font.color[0] != "#" ? font.color : parseInt(font.color.replace("#", ""), 16);
			}
			return {
				"fontPath": !!font ? "./resources/fonts/" + mapFontName(font) + ".ttf" : defaultFontOptions.fontPath,
				"size": !!font.size ? parseInt(font.size, 10) : defaultFontOptions.size,
				"color": color
			}
		};

		var mapTextBox = function (el, size) {
			return {
				top: size.top,
				left: size.left,
				width: size.width,
				height: size.height,
				stream: {
					items: [
						{
							type: "text",
							text: [el.content],
							options: mapFontOptions(el.font)
						}
					]
				}
			}
		};
		var mapValueBox = function (el, size) {
			return {
				top: size.top,
				left: size.left,
				text: {
					text: el.content,
					options: mapFontOptions(el.font)
				}
			}
		};
		var mapEmptyBox = function (el, size) {
			return {
				top: size.top,
				left: size.left,
				width: size.width,
				height: size.height,
				stream: {
					items: [
						{
							type: "text",
							text: ['!!! ' +  el.elementName + '('  + el.name + ') - missing element'],
							options: mapFontOptions(el.font)
						}
					]
				}
			}
		};
		var externals = {};

		var mapImageBox = function (el, size) {
			externals[el.name] = el.url;
			return {
				top: size.top,
				left: size.left,
				image: {
					external: el.name,
					transformation: {
						width: el.width * pixelPerPoint,
						height: el.height * pixelPerPoint
					}
				}
			}
		};
		var pixelPerPoint = 0.75;
		var marginPoints = 21.6; //7,62 mm
		var mapBox = function (node) {
			var sizes = {
				top: 842 - ((node.style.top * pixelPerPoint) + marginPoints),
				left: node.style.left * pixelPerPoint + marginPoints,
				height: node.style.height * pixelPerPoint,
				width: node.style.width * pixelPerPoint
			};
			var el = node.element;
			if (el.elementName === "TextBox" && el.content !== undefined) return mapTextBox(el, sizes);
			if (el.elementName === "ValueBox" && !!el.Binding) return mapValueBox(el, sizes);
			if (el.elementName === "ImageBox" && el.url !== undefined) return mapImageBox(el, sizes);
			

			return mapEmptyBox(el, sizes);
		};

		//extract
		var pdf = {
			externals: externals,
			pages: pages.map(function (page) {
				return {
					width: 595,
					height: 842,
					boxes: _.filter(page.boxes.map(function (box) {
						return mapBox(box)
					}), function (item) {
						return item !== undefined
					})
				};
			})
		};
		return pdf;
	}

	generatePDFDocument(inDocumentString, successCB, failureCB) {

		var noOp = function () {
		};

		function openPDFWhenDone(inServiceURL, inData, successCB, failureCB) {
			if (inData.status == 0) {
				successCB(inServiceURL + '/generatedFiles/' + inData.generatedFileID);
			}
			else if (inData.status == 2 && failureCB) {
				failureCB(inData);
			}
			else {
				window.setTimeout(function () {
					request.get(inServiceURL + '/generationjobs/' + inData.jobID)
						.end(function (err, res) {
							if (res.ok) {
								openPDFWhenDone(inServiceURL, JSON.parse(res.text), successCB, failureCB);
							} else {
								failureCB('Oh no! error ' + res.text);
							}
						})
				}, 1000);
			}
			;
		}

		failureCB = failureCB || noOp;

		var url = this.url;
		request
			.post(url + '/generationjobs')
			.send(this.transformToPdfDocument(inDocumentString))
			.set('Accept', 'application/json')
			.end(function (err, res) {
				if (res.ok) {
					openPDFWhenDone(url, JSON.parse(res.text), successCB, failureCB);
				} else {
					failureCB('Oh no! error ' + res.text);
				}
			})
	}
}

