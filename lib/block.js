'use strict';

var util = require('util');
var path = require('path');
var slash = require('slash');
var fs = require("fs");
var common = require("./common");

//创建多层文件夹 同步
function mkdirsSync(dirname, mode){
    mode = mode || "0777";
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirsSync(path.dirname(dirname), mode)){
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

var Block = function (config, file, match) {
    this.replacement = match[0];
    this.linefeed = match[1];
    this.indent = match[2];
    this.beginTag = match[3];
    this.taskName = match[4];
    this.originalContent = match[5];
    this.endTag = match[6];

    this.replacements = [];
    this.config = config;
    this.template = null;
    this.file = file;
};

Block.prototype.build = function (index) {
    var fileDir = path.dirname(this.file.path);
    var orgFileName = path.basename(this.file.path,path.extname(this.file.path));

    var paths = common.regexMatchPath(this.replacement,this.taskName);
    var contents = [];
    for (var i = 0; i < paths.length; i++) {
        var item = paths[i];
        if(item.indexOf("http")>0){
            continue;
        }
        var realFilePath = path.resolve(fileDir,item);
        if(!fs.existsSync(realFilePath)){//文件是否存在
            continue;
        }
        if(this.taskName == "js" && i!=0){
            contents.push("\n;");
        }
        contents.push(fs.readFileSync(realFilePath,"utf8"));
    }

    var prefix = this.config.prefix || "concat";
    var output = this.config.output || {"css":"./tmp/css","js":"./tmp/js"};
    var outputDir = output[this.taskName];
    var realOutputDir = path.resolve(process.cwd(),outputDir);

    if(!fs.existsSync(realOutputDir)){
        mkdirsSync(realOutputDir);
    }
    var fileName = orgFileName+"_"+prefix+"_"+index+"."+this.taskName;

    fs.writeFileSync(realOutputDir+"/"+fileName,contents.join(''));
    
    if (this.taskName === 'js') {
        return util.format('%s<script src="%s"></script>', this.indent, outputDir+"/"+fileName);
    } else if (this.taskName === 'css') {
        return util.format('%s<link rel="stylesheet" href="%s">', this.indent, outputDir+"/"+fileName);
    }
    return this.indent;
};

Block.prototype.compile = function (index) {

    var buildResult = this.build(index);

    return buildResult;
};

module.exports = Block;
