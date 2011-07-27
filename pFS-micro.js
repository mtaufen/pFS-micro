/*
Licensed under the MIT license, http://www.opensource.org/licenses/mit-license.php

Copyright (c) 2011 Michael Taufen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function (window, document, undefined) {
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

	var errorHandler = function (e) {
		var msg = '';
		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'QUOTA_EXCEEDED_ERR';
			break;

			case FileError.NOT_FOUND_ERR:
				msg = 'NOT_FOUND_ERR';
			break;

			case FileError.SECURITY_ERR:
				msg = 'SECURITY_ERR';
			break;

			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'INVALID_MODIFICATION_ERR';
			break;

			case FileError.INVALID_STATE_ERR:
				msg = 'INVALID_STATE_ERR';
			break;

			default:
				msg = 'Unknown Error';
			break;
		}
	}	


	var pFS = { //filesystem namespace
		set : function (size, callback) { //string
				window.requestFileSystem(window.PERSISTENT, size, callback, errorHandler);
		},
		writeOver : function (fs, filename, dataToWrite, callback) { //object, string, string, function(e)
					fs.root.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
						fileEntry.createWriter(function (fileWriter) {
							fileWriter.onwriteend = callback;
							fileWriter.onerror = function (e) {
								console.log( 'Write failed: ' + e.toString() );
							};
							var bb = new window.WebKitBlobBuilder(); //chrome 12 only (but also workig in app for chrome 11...) BlobBuilder() is spec
							bb.append(dataToWrite);
							fileWriter.write(bb.getBlob('text/plain'));
						}, errorHandler);
					}, errorHandler);
		},
	
		//TODO: appendTo
	
		readFrom : function (fs, filename, callback) { //object, string, function(e) receives... filedata?... sure seems that way
					fs.root.getFile(filename, {}, function (fileEntry) {
						fileEntry.file(function (file) {
							var reader = new FileReader();
							reader.onloadend = callback;
							reader.readAsText(file);
						}, errorHandler);	
					}, errorHandler);
		},
	
		//TODO: delete

	}; //end filesystem namespace

	window.pFS = pFS; //add the namespace to the global scope
	
})(this, document);