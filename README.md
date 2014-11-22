plaintext.js
============

A library for converting Markdown, etc to HTML. Built for use in [TextDrop](https://www.textdropapp.com).

USAGE
-----
```js
var plaintext = require('plaintext.js');
var converter = plaintext.newConverter("multimarkdown", {
   export_format: plaintext.multimarkdown.HTML_FORMAT,  // default
   parser_extensions: [
      plaintext.multimarkdown.EXT_NOTES,  // enable footnotes
      plaintext.multimarkdown.EXT_SMART,  // enable smart quotes
   ]
});
converter.convert("hello **world**", function(html) {
   console.log(html); 
});
```

SUPPORTED FORMATS
-----------------
- `multimarkdown` - [MultiMarkdown 4](https://github.com/fletcher/MultiMarkdown-4) compiled to native JS
    - options:
        - `export_format`
            - `plaintext.multimarkdown.HTML_FORMAT` **default**
            - `plaintext.multimarkdown.TEXT_FORMAT`
            - `plaintext.multimarkdown.LATEX_FORMAT`
            - `plaintext.multimarkdown.MEMOIR_FORMAT`
            - `plaintext.multimarkdown.BEAMER_FORMAT`
            - `plaintext.multimarkdown.OPML_FORMAT`
            - `plaintext.multimarkdown.ODF_FORMAT`
            - `plaintext.multimarkdown.RTF_FORMAT`
            - `plaintext.multimarkdown.CRITIC_ACCEPT_FORMAT`
            - `plaintext.multimarkdown.CRITIC_REJECT_FORMAT`
            - `plaintext.multimarkdown.CRITIC_HTML_HIGHLIGHT_FORMAT`
        - `parser_extensions` (pass as Array) 
            - `plaintext.multimarkdown.EXT_COMPATIBILITY`: Markdown compatibility mode
            - `plaintext.multimarkdown.EXT_COMPLETE`: Create complete document
            - `plaintext.multimarkdown.EXT_SNIPPET`: Create snippet only
            - `plaintext.multimarkdown.EXT_SMART`: Enable Smart quotes
            - `plaintext.multimarkdown.EXT_NOTES`: Enable Footnotes
            - `plaintext.multimarkdown.EXT_NO_LABELS`: Don't add anchors to headers, etc.
            - `plaintext.multimarkdown.EXT_FILTER_STYLES`: Filter out style blocks
            - `plaintext.multimarkdown.EXT_FILTER_HTML`: Filter out raw HTML
            - `plaintext.multimarkdown.EXT_PROCESS_HTML`: Process Markdown inside HTML
            - `plaintext.multimarkdown.EXT_NO_METADATA`: Don't parse Metadata
            - `plaintext.multimarkdown.EXT_OBFUSCATE`: Mask email addresses
            - `plaintext.multimarkdown.EXT_CRITIC`: Critic Markup Support
            - `plaintext.multimarkdown.EXT_CRITIC_ACCEPT`: Accept all proposed changes
            - `plaintext.multimarkdown.EXT_CRITIC_REJECT`: Reject all proposed changes