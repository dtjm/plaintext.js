plaintext.js ![Build status](https://api.travis-ci.org/dtjm/plaintext.js.png)
============

A library for converting Markdown, etc to HTML

USAGE
-----

Browser script 

    <script src="plaintext.js"></script>
    <script>
        plaintext.multimarkdown("**hello *world*!**");
    </script>

Require.js
    
    <script>
    require('plaintext', function(plaintext) {
        plaintext.multimarkdown("**hello *world*!**");
    });

Node.js

    var plaintext = require('plaintext.js');
    plaintext.multimarkdown("**hello *world*!**");

TODO
----
- [ ] Add MultiMarkdown support
- [ ] Add exports
