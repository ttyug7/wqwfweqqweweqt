"use strict";exports.__esModule=true;exports.getLocalFileName=getLocalFileName;const cwd=process.cwd();function getLocalFileName(request){return request.substr(request.lastIndexOf(cwd)+cwd.length);}