'use strict';

var srcRegex = {
    css:/\n?[ \t]*<link[^>]+href\s*=\s*["|']([\s\S]*?)["|'][^>]*>\n?/igm,
    js:/\n?[ \t]*<script[^>]+src\s*=\s*["|']([\s\S]*?)["|'][^>]*>[^>]*<\/script>\n?/igm
};

module.exports = {
    /**
     * tasks = {
     *     'task-name': {
     *         'src': [file1, file2],
     *         'tpl': '<script src="%s"></script>'
     *     },
     *     ....
     * }
     **/
    parseTasks: function (options) {
        options = options || {};

        var utilExtensions = /%f|%e/g;
        var tasks = {};

        Object.keys(options).forEach(function (key) {
            var item = options[key];
            var src = [];
            var tpl = null;
            var uniqueExtensions = {};
            var result;
            var srcIsNull;

            if (typeof item.src !== 'undefined') {
                srcIsNull = item.src === null;
                src = src.concat(item.src);
                tpl = item.tpl;
            } else {
                src = src.concat(item);
            }

            while (result = utilExtensions.exec(tpl)) {
                var type = result[0];
                var unique = {};

                if (uniqueExtensions[type]) {
                    continue;
                }

                unique.regex = new RegExp(result[0], "g");
                unique.value = null;
                uniqueExtensions[type] = unique;
            }

            tasks[key] = {
                src: src,
                tpl: tpl,
                uni: uniqueExtensions,
                srcIsNull: srcIsNull
            };
        });

        return tasks;
    },

    regexMatchAll: function (string, regexp) {
        var matches = [];
        string.replace(regexp, function () {
            var arr = Array.prototype.slice.call(arguments);
            matches.push(arr);
        });
        return matches;
    },

    regexMatchPath:function(string, type){
        var matches = [];
        string.replace(srcRegex[type], function () {
            var arr = Array.prototype.slice.call(arguments);
            matches.push(arr[1]);
        });
        return matches;
    }
};
