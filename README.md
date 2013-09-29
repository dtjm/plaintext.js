plaintext.js
============

A library for converting Markdown, etc to HTML

USAGE
-----

    <script src="plaintext.js"></script>
    <script>
        var text = "**hello *world***!";
        var html = plaintext.multimarkdown(text);
        document.write(html);
    </script>

TODO
----
- [ ] Add MultiMarkdown support
