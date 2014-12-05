// Just ensure that we can load the node module
var plaintext = require('../../dist/plaintext.js');
if (!plaintext) {
	console.log("unable to load node module");
	process.exit(1);
}

var r = new plaintext.Renderer(plaintext.RendererType.MULTIMARKDOWN, {});
r.render("**bold**", function(html){
	console.log("**bold** => " + html);
})