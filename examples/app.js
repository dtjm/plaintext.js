// == REQUIRES ==
var plaintext = require("../dist/index.js")


var converter = plaintext.newConverter("multimarkdown", {
	parser_extensions: [plaintext.multimarkdown.EXT_SMART]
});

var input = document.getElementById("in");
var iframe = document.getElementById("out")

input.onkeyup = function(e) {
	converter.convert(e.target.value, function(s) {
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write(s);
		iframe.contentWindow.document.close();
	});
}