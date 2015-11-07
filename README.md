# gulp-concat-replace [![NPM version][npm-image]][npm-url]

> Replace build blocks with js or css contact in HTML. Like useref but done right.
 

### Table of Contents

- [Usage](#usage)
- [API](#api)
- [Example](#example)
- [Upgrade](#upgrade)


## Usage
Install:
```shell
npm install --save-dev gulp-concat-replace
```

Put some blocks in your HTML file:
```html
<!-- build:name -->
<script src="./xxx.js" type="text/javascript"></script>
<script src="./xxx1.js" type="text/javascript"></script>
<script src="./xxx2.js" type="text/javascript"></script>
<!-- endbuild -->

or 

<!-- build:name -->
<link rel="stylesheet" type="text/css" href="./xxx.css">
<link rel="stylesheet" type="text/css" href="./xxx1.css">
<link rel="stylesheet" type="text/css" href="./xxx2.css">
<!-- endbuild -->

```
`name` is the name of the block, and css or js.

## API
### concatreplace(options)

#### options
Type: `object`

- {String} **prefix** - 合并和文件名的前缀，默认值："concat".
- {Object} **output** - 合并后文件的存储路径，包括css和js的路径（相对于gulpfile.js文件）.默认值：
```json
{"js":"./tmp/js","css":"./tmp/css"}
```

## Example
index.html:

```html
<!DOCTYPE html>
<html>
    <head>

    <!-- build:css -->
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/main.css">
    <!-- endbuild -->

    </head>
    <body>

    <!-- build:js -->
    <script src="js/player.js"></script>
    <script src="js/monster.js"></script>
    <script src="js/world.js"></script>
    <!-- endbuild -->
```

gulpfile.js:

```javascript
var gulp = require('gulp');
var concatreplace = require('gulp-concat-replace');

gulp.task('default', function() {
  gulp.src('index.html')
    .pipe(concatreplace({
    	prefix:"concat",
        output:{
        	css:"./build/css",
            js:"./build/js"
        }
    }))
    .pipe(gulp.dest('build/'));//html替换后的目录
});
```

Result:

```html
<!DOCTYPE html>
<html>
    <head>

    <link rel="stylesheet" href="concat1.css">

    </head>
    <body>

    <script src="js/concat2.js"></script>
```

```html
相关目录
|-gulpfile.js
|-build
|--css
|---concat1.css
|--js
|---contact2.js
|-index.html

```

## 感谢

本插件参考了gulp-html-replace，所以需要感谢Vladimir Kucherenko提供了gulp-html-replace

[npm-url]: https://npmjs.org/package/gulp-html-replace
[npm-image]: http://img.shields.io/npm/v/gulp-html-replace.svg

