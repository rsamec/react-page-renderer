//'use strict';
//
//import request from 'superagent';
//
//export default class pdfKitService {
//
//	constructor(url){
//		this.url = url || 'http://hand-formvalidation.rhcloud.com';
//	}
//	generatePDFDocument(inDocumentString, successCB, failureCB) {
//		var noOp = function(){}
//			
//		var b64toBlob = function(b64Data, contentType, sliceSize) {
//			contentType = contentType || '';
//			sliceSize = sliceSize || 512;
//
//			var byteCharacters = atob(b64Data);
//			var byteArrays = [];
//
//			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//				var slice = byteCharacters.slice(offset, offset + sliceSize);
//
//				var byteNumbers = new Array(slice.length);
//				for (var i = 0; i < slice.length; i++) {
//					byteNumbers[i] = slice.charCodeAt(i);
//				}
//
//				var byteArray = new Uint8Array(byteNumbers);
//
//				byteArrays.push(byteArray);
//			}
//
//			var blob = new Blob(byteArrays, {type: contentType});
//			return blob;
//		}
//		
//		function openPDFWhenDone(url, inData, successCB, failureCB) {
//			var file = b64toBlob(inData, 'application/pdf');
//			var fileURL = URL.createObjectURL(file);
//			successCB(fileURL);
//			//window.open(fileURL);
//		}
//
//		failureCB = failureCB || noOp;
//		
//		var url = this.url;
//		
//		request
//			.post(url + '/generationjobs')
//			.send(inDocumentString)
//			.set('Accept', 'application/json')
//			.end(function (err, res) {
//				if (res.ok) {
//					openPDFWhenDone(url, res.text, successCB, failureCB);
//				} else {
//					failureCB('Oh no! error ' + res.text);
//				}
//			})
//	}
//}
//
