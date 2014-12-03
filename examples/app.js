// == REQUIRES ==
require(['../dist/plaintext'], function(plaintext) {

	var renderer = new plaintext.Renderer(plaintext.RendererType.TASKPAPER, {
		parserExtensions: [plaintext.MultiMarkdown.EXT_SMART]
	});

	var input = document.getElementById("in");
	var iframe = document.getElementById("out")

	input.onkeyup = function(e) {
		renderer.render(e.target.value, function(s) {
			iframe.contentWindow.document.open();
			iframe.contentWindow.document.write(s);
			iframe.contentWindow.document.close();
		});
	}
});