
var parser_extensions = {
    EXT_COMPATIBILITY   : 1 << 0,    /* Markdown compatibility mode */
    EXT_COMPLETE        : 1 << 1,    /* Create complete document */
    EXT_SNIPPET         : 1 << 2,    /* Create snippet only */
    EXT_SMART           : 1 << 4,    /* Enable Smart quotes */
    EXT_NOTES           : 1 << 5,    /* Enable Footnotes */
    EXT_NO_LABELS       : 1 << 6,    /* Don't add anchors to headers, etc. */
    EXT_FILTER_STYLES   : 1 << 7,    /* Filter out style blocks */
    EXT_FILTER_HTML     : 1 << 8,    /* Filter out raw HTML */
    EXT_PROCESS_HTML    : 1 << 9,    /* Process Markdown inside HTML */
    EXT_NO_METADATA     : 1 << 10,    /* Don't parse Metadata */
    EXT_OBFUSCATE       : 1 << 11,   /* Mask email addresses */
    EXT_CRITIC          : 1 << 12,   /* Critic Markup Support */
    EXT_CRITIC_ACCEPT   : 1 << 13,   /* Accept all proposed changes */
    EXT_CRITIC_REJECT   : 1 << 14   /* Reject all proposed changes */
};

/* Define output formats we support -- first in list is default */
var export_formats = {
    HTML_FORMAT                  : 0,
    TEXT_FORMAT                  : 1,
    LATEX_FORMAT                 : 2,
    MEMOIR_FORMAT                : 3,
    BEAMER_FORMAT                : 4,
    OPML_FORMAT                  : 5,
    ODF_FORMAT                   : 6,
    RTF_FORMAT                   : 7,
    CRITIC_ACCEPT_FORMAT         : 9,
    CRITIC_REJECT_FORMAT         : 10,
    CRITIC_HTML_HIGHLIGHT_FORMAT : 11
};
var markdown_to_string = Module.cwrap('markdown_to_string', 'string', ['string', 'number', 'number']);
var multimarkdown = function(string, opts) {
    return markdown_to_string(string);
};

// Exporting
var plaintext = {
    multimarkdown: multimarkdown
};

module.exports = plaintext;

}());
