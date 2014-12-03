/// <reference path="../typings/tsd.d.ts" />
export module MultiMarkdown {

    export enum ParserExtension {
        EXT_COMPATIBILITY = 1 << 0, // Markdown compatibility mode
        EXT_COMPLETE = 1 << 1, // Create complete document
        EXT_SNIPPET = 1 << 2, // Create snippet only
        EXT_SMART = 1 << 4, // Enable Smart quotes
        EXT_NOTES = 1 << 5, // Enable Footnotes
        EXT_NO_LABELS = 1 << 6, // Don't add anchors to headers, etc.
        EXT_FILTER_STYLES = 1 << 7, // Filter out style blocks
        EXT_FILTER_HTML = 1 << 8, // Filter out raw HTML
        EXT_PROCESS_HTML = 1 << 9, // Process Markdown inside HTML
        EXT_NO_METADATA = 1 << 10, // Don't parse Metadata
        EXT_OBFUSCATE = 1 << 11, // Mask email addresses
        EXT_CRITIC = 1 << 12, // Critic Markup Support
        EXT_CRITIC_ACCEPT = 1 << 13, // Accept all proposed changes
        EXT_CRITIC_REJECT = 1 << 14 // Reject all proposed changes
    };

    /* Define output formats we support -- first in list is default */
    export enum ExportFormat {
        HTML_FORMAT = 0,
        TEXT_FORMAT = 1,
        LATEX_FORMAT = 2,
        MEMOIR_FORMAT = 3,
        BEAMER_FORMAT = 4,
        OPML_FORMAT = 5,
        ODF_FORMAT = 6,
        RTF_FORMAT = 7,
        CRITIC_ACCEPT_FORMAT = 9,
        CRITIC_REJECT_FORMAT = 10,
        CRITIC_HTML_HIGHLIGHT_FORMAT = 11
    };


    interface Options {
        parserExtensions ? : Array < ParserExtension > ;
        exportFormat ? : ExportFormat;
    }

    var markdown_to_string = Module.cwrap('markdown_to_string', 'string', ['string', 'number', 'number']);
    var mmd_version = Module.cwrap('mmd_version', 'string', []);

    export class Renderer {
        private _parserExtensionsSum: number;
        private _exportFormat: ExportFormat;

        constructor(opts: Options) {
            var extensionsSum = 0;
            var format = ExportFormat.HTML_FORMAT;

            if (opts.parserExtensions) {
                for (var i = opts.parserExtensions.length - 1; i >= 0; i--) {
                    extensionsSum = extensionsSum | opts.parserExtensions[i];
                };
            }

            if (opts.exportFormat) {
                this._exportFormat = opts.exportFormat;
            }
        }

        render(input: string, cb: (output: string) => void) {
            cb(markdown_to_string(input, this._parserExtensionsSum, this._exportFormat));
        }

        metadata() {
            return {
                url: "https://github.com/fletcher/MultiMarkdown-4",
                version: mmd_version(),
                id: "markdown/multimarkdown/" + mmd_version(),
                name: "MultiMarkdown"
            }
        }
    }
}


/***
 * taskpaper.js - Convert TaskPaper text file to HTML
 * Based heavily on tp_to_html.pl by Jim Kang
 * http://death-mountain.com/2010/05/taskpaper-to-html-conversion-script/
 * Converted to TypeScript by Sam Nguyen
 *
 * @author Sam Nguyen <samxnguyen@gmail.com> David Hilowitz <dhilowitz@gmail.com>, Jim Kang
 **/
module TaskPaper {

    export class Renderer {
        private taskDiv: string;
        private taskPaperUrl: string;
        private g_indentLevel: number;
        private kIndentTag: string;
        private kOutdentTag: string;
        private kNoteClass: string;
        private kItemTagName: string;
        private kTaskClass: string;
        private kTagClassPrefix: string;
        private kTagClass: string;
        private kProjectClass: string;
        private intervalID: number;

        // constructor(taskDivSelector: string, taskPaperUrl: string, updateFrequency: number) {
        constructor() {
            var taskDivSelector: string;
            var taskPaperUrl: string;

            // if (document.querySelector(taskDivSelector).length == 0) {
            //     console.log("The div selector supplied didn't turn up any divs in the document.");
            //     return;
            // }
            this.taskDiv = taskDivSelector;
            this.taskPaperUrl = taskPaperUrl;

            this.g_indentLevel = 0;
            this.kIndentTag = "<ul>\n";
            this.kOutdentTag = "</ul>\n";
            this.kNoteClass = "tpnote";
            this.kItemTagName = "li";
            this.kTaskClass = "tptask";
            this.kTagClassPrefix = "tptag-";
            this.kTagClass = "tptag"
            this.kProjectClass = "tpproject";
        }

        render(input, callback) {
            callback(this.convertTaskpaperToHtml(input));
        }

        metadata() {
            return {
                url: "https://github.com/dhilowitz/jsTaskPaper/",
                version: "fd10dd7f901e77ffccf98f9e65a49180a1900d22",
                id: "taskpaper/dhilowitz/fd10dd7f901e77ffccf98f9e65a49180a1900d22",
                name: "TaskPaper"
            };
        }

        private convertTaskpaperToHtml(taskPaperText: string): string {
            var outputHtml = "";

            var tppObject = this;
            var lines = taskPaperText.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var outputLine = lines[i] + '\n';
                outputLine = tppObject.tagLine(outputLine)
                outputLine = tppObject.indentLine(outputLine);
                outputHtml = outputHtml + outputLine;
            };

            // At the end of the file, close any open indentation tags.
            for (var j = 0; j < this.g_indentLevel; j++) {
                outputHtml = outputHtml + this.kOutdentTag;
            }
            return "<ul class=\"tptop\">" + outputHtml + "</ul>";
        }

        // Adds the necessary tags to indent the line as needed and returns the indented line.
        // Updates the global $g_indentLevel variable.
        private indentLine(line): string {
            // Count the tabs.
            var tabCount = this.numberOfTabs(line);

            if (this.g_indentLevel != tabCount) {
                var tag = this.kOutdentTag;
                if (this.g_indentLevel < tabCount) {
                    tag = this.kIndentTag;
                }

                for (var i = 0; i < Math.abs(this.g_indentLevel - tabCount); ++i) {
                    // Set up the right number of tabs. (Need the tabs to make the html source readable.)           
                    var tabsForThisLine = "";
                    var numberOfOutputTabs = i;
                    if (this.g_indentLevel < tabCount) {
                        numberOfOutputTabs = this.g_indentLevel - i;
                    }

                    for (var j = 0; j < numberOfOutputTabs; ++j) {
                        tabsForThisLine = tabsForThisLine + "\t";
                    }

                    // Add the tabs and indent tag.
                    line = tabsForThisLine + tag + line;
                }

                this.g_indentLevel = tabCount;
            }

            return line;
        }

        // // Returns the line with the appropriate tags added.
        private tagLine(line): string {

            var itemClass = this.kNoteClass;

            //  If it starts with "- ", it's a task.
            if (line.match(/^(\s*)\- /)) {
                itemClass = this.kTaskClass;
                line = line.replace(/^(\s*)\- /, "$1");

                var tags = line.match(/@[^\s]+/g);

                if (tags != undefined) {
                    var currentTag: string;

                    for (var i = 0; i < tags.length; i++) {
                        var originalTag = tags[i];
                        line = line.replace(originalTag, "<span class=\"" + this.kTagClass + "\">" + originalTag + "</span>");
                        originalTag = originalTag.replace("@", "");

                        // Remove parameterized stuff
                        currentTag = originalTag.replace(/([^\s\(\)]+)\s*\(.*\)/, "$1");
                        itemClass = itemClass + " " + this.kTagClassPrefix + currentTag;

                        // Add parameterized stuff
                        if (originalTag.match(/(.+)\((.*)\)/)) {
                            var parameterTag = originalTag.replace(/(.+)\((.*)\)/, "$1-$2");
                            if (parameterTag.length > 0)
                                itemClass = itemClass + " " + this.kTagClassPrefix + parameterTag;
                        }
                    }
                }

            } else {
                // If it ends with ":", it's a project.
                if (line.match(/:\s*$/)) {
                    itemClass = this.kProjectClass;
                    line = line.replace(/:\s*$/, "\n"); // Get rid of the ":".
                }
            }

            var openTag = "<" + this.kItemTagName + " class=\"" + itemClass + "\">";
            var closeTag = "</" + this.kItemTagName + ">";

            // Squeeze the opening and closing tags in after the whitespace at the beginning 
            // of the line and at the end of the line, respectively.
            line = line.replace(/^(\s*)(.*)/, "$1" + openTag + "$2" + closeTag + "\n");
            return line;
        }

        // Returns the number of tabs at the start of the screen
        private numberOfTabs(text): number {
            var count = 0;
            var index = 0;
            while (text.charAt(index++) === "\t") {
                count++;
            }
            return count;
        }
    }
}

module Textile {

    interface Options {
        breaks ? : boolean;
    }

    declare function textile(input, opts);

    export class Renderer {
        private _options: Options;

        constructor(opts: Options) {
            this._options = opts;
        }

        render(input, callback) {
            callback(textile(input, this._options));
        }

        metadata() {
            return {
                url: "https://github.com/borgar/textile-js",
                version: "0.1.9",
                id: "textile/borgar/0.1.9",
                name: "Textile"
            };
        }
    }
}

interface IRenderer {
    render: (input: string, callback: (output: string) => void) => void;
    metadata: () => RendererMetadata;
}

export interface RendererMetadata {
    url: string;
    version: string;
    name: string;
    id: string;
}

export enum RendererType {
    MULTIMARKDOWN,
    TASKPAPER,
    TEXTILE,
}

// Concrete class to proxy back to an actual renderer
export class Renderer {
    private _renderer: IRenderer;

    constructor(rendererType: RendererType, options) {
        if (options === undefined) {
            throw Error("you must pass options object to Renderer() constructor");
        }

        switch (rendererType) {
            case RendererType.MULTIMARKDOWN:
                this._renderer = new MultiMarkdown.Renderer(options);
                break;
            case RendererType.TASKPAPER:
                this._renderer = new TaskPaper.Renderer();
                break;
            case RendererType.TEXTILE:
                this._renderer = new Textile.Renderer(options);
                break;
            default:
                throw new Error('you must provide one of the following renderer types: ' +
                    'MULTIMARKDOWN, TASKPAPER, TEXTILE');
        }
    }

    render(input: string, callback: (output: string) => void) {
        this._renderer.render(input, function(result) {
            callback(result);
        })
    }

    metadata() {
        return this._renderer.metadata();
    }
}