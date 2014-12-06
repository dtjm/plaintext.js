plaintext.js
============

A library for converting plaintext
formats to HTML. Built for client-side plaintext rendering in
[TextDrop](https://www.textdropapp.com).

Currently supports:

- [MultiMarkdown 4](https://github.com/fletcher/MultiMarkdown-4) (compiled to JS via Emscripten)
- [TaskPaper](https://github.com/dhilowitz/jsTaskPaper)
- [Textile](https://github.com/borgar/textile-js)
- [Fountain](https://github.com/mattdaly/Fountain.js)

### Usage
```js
var plaintext = require('plaintext');  // Also importable using require.js/AMD-style import

var renderer = new plaintext.Renderer('MULTIMARKDOWN', {   // or "TEXTILE", "TASKPAPER", "FOUNTAIN"
   exportFormat: plaintext.MultiMarkdown.ExportFormat.HTML,  // default
   parserExtensions: [
      plaintext.MultiMarkdown.ParserExtension.NOTES,  // enable footnotes
      plaintext.MultiMarkdown.ParserExtension.SMART,  // enable smart quotes
   ]
});

renderer.render("hello **world**", function(html) {
   console.log(html);  
   // prints "<p>hello <strong>world</strong></p>"
});
```

### API

#### new plaintext.Renderer(rendererType, options)
- `rendererType` can be "MULTIMARKDOWN", "TEXTILE", "TASKPAPER", or "FOUNTAIN",
- `options` must be an object

#### Renderer.render(input, callback)

### MultiMarkdown options
- `MULTIMARKDOWN`
    - `exportFormat`
        - `plaintext.MultiMarkdown.ExportFormat.HTML` **default**
        - `plaintext.MultiMarkdown.ExportFormat.TEXT`
        - `plaintext.MultiMarkdown.ExportFormat.LATEX`
        - `plaintext.MultiMarkdown.ExportFormat.MEMOIR`
        - `plaintext.MultiMarkdown.ExportFormat.BEAMER`
        - `plaintext.MultiMarkdown.ExportFormat.OPML`
        - `plaintext.MultiMarkdown.ExportFormat.ODF`
        - `plaintext.MultiMarkdown.ExportFormat.RTF`
        - `plaintext.MultiMarkdown.ExportFormat.CRITIC_ACCEPT`
        - `plaintext.MultiMarkdown.ExportFormat.CRITIC_REJECT`
        - `plaintext.MultiMarkdown.ExportFormat.CRITIC_HTML_HIGHLIGHT`
    - `parserExtensions` (pass as Array) 
        - `plaintext.MultiMarkdown.ParserExtension.COMPATIBILITY`: Markdown compatibility mode
        - `plaintext.MultiMarkdown.ParserExtension.COMPLETE`: Create complete document
        - `plaintext.MultiMarkdown.ParserExtension.SNIPPET`: Create snippet only
        - `plaintext.MultiMarkdown.ParserExtension.SMART`: Enable Smart quotes
        - `plaintext.MultiMarkdown.ParserExtension.NOTES`: Enable Footnotes
        - `plaintext.MultiMarkdown.ParserExtension.NO_LABELS`: Don't add anchors to headers, etc.
        - `plaintext.MultiMarkdown.ParserExtension.FILTER_STYLES`: Filter out style blocks
        - `plaintext.MultiMarkdown.ParserExtension.FILTER_HTML`: Filter out raw HTML
        - `plaintext.MultiMarkdown.ParserExtension.PROCESS_HTML`: Process Markdown inside HTML
        - `plaintext.MultiMarkdown.ParserExtension.NO_METADATA`: Don't parse Metadata
        - `plaintext.MultiMarkdown.ParserExtension.OBFUSCATE`: Mask email addresses
        - `plaintext.MultiMarkdown.ParserExtension.CRITIC`: Critic Markup Support
        - `plaintext.MultiMarkdown.ParserExtension.CRITIC_ACCEPT`: Accept all proposed changes
        - `plaintext.MultiMarkdown.ParserExtension.CRITIC_REJECT`: Reject all proposed changes