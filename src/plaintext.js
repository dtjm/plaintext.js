(function() {

    /*****************
     * MULTIMARKDOWN *
     *****************/
    // Create wrapped versions of the functions exported by libmultimarkdown
    var markdown_to_string = Module.cwrap('markdown_to_string', 'string', ['string', 'number', 'number']);
    var mmd_version = Module.cwrap('mmd_version', 'string', []);

    var MultiMarkdown = {};

    MultiMarkdown.ParserExtension = {
        "COMPATIBILITY": 1 << 0,
        "COMPLETE": 1 << 1,
        "SNIPPET": 1 << 2,
        "SMART": 1 << 4,
        "NOTES": 1 << 5,
        "NO_LABELS": 1 << 6,
        "FILTER_STYLES": 1 << 7,
        "FILTER_HTML": 1 << 8,
        "PROCESS_HTML": 1 << 9,
        "NO_METADATA": 1 << 10,
        "OBFUSCATE": 1 << 11,
        "CRITIC": 1 << 12,
        "CRITIC_ACCEPT": 1 << 13,
        "CRITIC_REJECT": 1 << 14,
    };

    MultiMarkdown.ExportFormat = {
        "HTML": 0,
        "TEXT": 1,
        "LATEX": 2,
        "MEMOIR": 3,
        "BEAMER": 4,
        "OPML": 5,
        "ODF": 6,
        "RTF": 7,
        "CRITIC_ACCEPT": 9,
        "CRITIC_REJECT": 10,
        "CRITIC_HTML_HIGHLIGHT": 11,
    };

    MultiMarkdown.Renderer = function(opts) {
        this._parserExtensionsSum = 0;
        var format = 0 /* HTML_FORMAT */ ;
        if (opts.parserExtensions) {
            for (var i = opts.parserExtensions.length - 1; i >= 0; i--) {
                this._parserExtensionsSum =
                    this._parserExtensionsSum | opts.parserExtensions[i];
            };
        }
        if (opts.exportFormat) {
            this._exportFormat = opts.exportFormat;
        }
    }

    MultiMarkdown.Renderer.prototype.render = function(input, cb) {
        cb(markdown_to_string(input, this._parserExtensionsSum, this._exportFormat));
    };

    MultiMarkdown.Renderer.prototype.metadata = function() {
        return {
            url: "https://github.com/fletcher/MultiMarkdown-4",
            version: mmd_version(),
            id: "markdown/multimarkdown/" + mmd_version(),
            name: "MultiMarkdown"
        };
    };

    /***
     * taskpaper.js - Convert TaskPaper text file to HTML
     * Based heavily on tp_to_html.pl by Jim Kang
     * http://death-mountain.com/2010/05/taskpaper-to-html-conversion-script/
     * Converted to TypeScript by Sam Nguyen
     *
     * @author Sam Nguyen <samxnguyen@gmail.com>, David Hilowitz <dhilowitz@gmail.com>, Jim Kang
     **/

    var TaskPaper = {};

    TaskPaper.Renderer = function() {
        this.g_indentLevel = 0;
        this.kIndentTag = "<ul>\n";
        this.kOutdentTag = "</ul>\n";
        this.kNoteClass = "taskpaper-note";
        this.kItemTagName = "li";
        this.kTaskClass = "taskpaper-task";
        this.kTagClassPrefix = "taskpaper-tag-";
        this.kTagClass = "taskpaper-tag";
        this.kProjectClass = "taskpaper-project";
    }

    TaskPaper.Renderer.prototype.render = function(input, callback) {
        callback(convertTaskpaperToHtml(input, this));
    };

    TaskPaper.Renderer.prototype.metadata = function() {
        return {
            url: "https://github.com/dhilowitz/jsTaskPaper/",
            version: "fd10dd7f901e77ffccf98f9e65a49180a1900d22",
            id: "taskpaper/dhilowitz/fd10dd7f901e77ffccf98f9e65a49180a1900d22",
            name: "TaskPaper"
        };
    };

    var convertTaskpaperToHtml = function(taskPaperText, renderer) {
        var outputHtml = "";
        var lines = taskPaperText.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var outputLine = lines[i] + '\n';
            outputLine = tagLine(outputLine, renderer);
            outputLine = indentLine(outputLine, renderer);
            outputHtml = outputHtml + outputLine;
        };
        for (var j = 0; j < renderer.g_indentLevel; j++) {
            outputHtml = outputHtml + renderer.kOutdentTag;
        }
        return "<ul class=\"taskpaper\">" + outputHtml + "</ul>";
    };

    // Adds the necessary tags to indent the line as needed and returns the indented line.
    // Updates the global $g_indentLevel variable.
    var indentLine = function(line, renderer) {
        // Count the tabs.
        var tabCount = numberOfTabs(line);
        if (renderer.g_indentLevel != tabCount) {
            var tag = renderer.kOutdentTag;
            if (renderer.g_indentLevel < tabCount) {
                tag = renderer.kIndentTag;
            }
            for (var i = 0; i < Math.abs(renderer.g_indentLevel - tabCount); ++i) {
                // Set up the right number of tabs. (Need the tabs to make the html source readable.)           
                var tabsForThisLine = "";
                var numberOfOutputTabs = i;
                if (renderer.g_indentLevel < tabCount) {
                    numberOfOutputTabs = renderer.g_indentLevel - i;
                }
                for (var j = 0; j < numberOfOutputTabs; ++j) {
                    tabsForThisLine = tabsForThisLine + "\t";
                }
                // Add the tabs and indent tag.
                line = tabsForThisLine + tag + line;
            }
            renderer.g_indentLevel = tabCount;
        }
        return line;
    };

    // Returns the line with the appropriate tags added.
    var tagLine = function(line, renderer) {
        var itemClass = renderer.kNoteClass;
        //  If it starts with "- ", it's a task.
        if (line.match(/^(\s*)\- /)) {
            itemClass = renderer.kTaskClass;
            line = line.replace(/^(\s*)\- /, "$1");
            var tags = line.match(/@[^\s]+/g);
            if (tags != undefined) {
                var currentTag;
                for (var i = 0; i < tags.length; i++) {
                    var originalTag = tags[i];
                    line = line.replace(originalTag, "<span class=\"" + renderer.kTagClass + "\">" + originalTag + "</span>");
                    originalTag = originalTag.replace("@", "");
                    // Remove parameterized stuff
                    currentTag = originalTag.replace(/([^\s\(\)]+)\s*\(.*\)/, "$1");
                    itemClass = itemClass + " " + renderer.kTagClassPrefix + currentTag;
                    // Add parameterized stuff
                    if (originalTag.match(/(.+)\((.*)\)/)) {
                        var parameterTag = originalTag.replace(/(.+)\((.*)\)/, "$1-$2");
                        if (parameterTag.length > 0)
                            itemClass = itemClass + " " + renderer.kTagClassPrefix + parameterTag;
                    }
                }
            }
        } else {
            // If it ends with ":", it's a project.
            if (line.match(/:\s*$/)) {
                itemClass = renderer.kProjectClass;
                line = line.replace(/:\s*$/, "\n"); // Get rid of the ":".
            }
        }
        var openTag = "<" + renderer.kItemTagName + " class=\"" + itemClass + "\">";
        var closeTag = "</" + renderer.kItemTagName + ">";
        // Squeeze the opening and closing tags in after the whitespace at the beginning 
        // of the line and at the end of the line, respectively.
        line = line.replace(/^(\s*)(.*)/, "$1" + openTag + "$2" + closeTag + "\n");
        return line;
    };

    // Returns the number of tabs at the start of the screen
    var numberOfTabs = function(text) {
        var count = 0;
        var index = 0;
        while (text.charAt(index++) === "\t") {
            count++;
        }
        return count;
    };

    var Textile = {};

    Textile.Renderer = function(opts) {
        this._options = opts;
    };

    Textile.Renderer.prototype.render = function(input, callback) {
        callback(textile(input, this._options));
    };

    Textile.Renderer.prototype.metadata = function() {
        return {
            url: "https://github.com/borgar/textile-js",
            version: "0.1.9",
            id: "textile/borgar/0.1.9",
            name: "Textile"
        };
    };

    var PlainText = {
        MultiMarkdown: MultiMarkdown
    };

    PlainText.RendererType = {
        "FOUNTAIN": "FOUNTAIN",
        "MULTIMARKDOWN": "MULTIMARKDOWN",
        "TASKPAPER": "TASKPAPER",
        "TEXTILE": "TEXTILE"
    };

    PlainText.Renderer = function(rendererType, options) {
        if (options === undefined) {
            throw Error("you must pass options object to Renderer() constructor");
        }
        switch (rendererType) {
            case PlainText.RendererType.MULTIMARKDOWN:
                this._renderer = new MultiMarkdown.Renderer(options);
                break;
            case PlainText.RendererType.TASKPAPER:
                this._renderer = new TaskPaper.Renderer();
                break;
            case PlainText.RendererType.TEXTILE:
                this._renderer = new Textile.Renderer(options);
                break;
            case PlainText.RendererType.FOUNTAIN:
                this._renderer = new Fountain.Renderer();
                break;
            default:
                throw new Error('you must provide one of the following renderer types: ' +
                    'FOUNTAIN, MULTIMARKDOWN, TASKPAPER, TEXTILE');
        }
    };

    PlainText.Renderer.prototype.render = function(input, callback) {
        this._renderer.render(input, function(result) {
            callback(result);
        });
    };

    PlainText.Renderer.prototype.metadata = function() {
        return this._renderer.metadata();
    };

    // see https://github.com/umdjs/umd
    if (typeof module === "object" && module.exports) {
        // CommonJS (Node)
        module.exports = PlainText;
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(function() {
            return PlainText;
        });
    }
})();