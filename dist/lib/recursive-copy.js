"use strict";exports.__esModule=true;exports.recursiveCopy=recursiveCopy;var _path=_interopRequireDefault(require("path"));var _fs=_interopRequireDefault(require("fs"));var _util=require("util");var _asyncSema=require("next/dist/compiled/async-sema");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const mkdir=(0,_util.promisify)(_fs.default.mkdir);const stat=(0,_util.promisify)(_fs.default.stat);const readdir=(0,_util.promisify)(_fs.default.readdir);const copyFile=(0,_util.promisify)(_fs.default.copyFile);const COPYFILE_EXCL=_fs.default.constants.COPYFILE_EXCL;async function recursiveCopy(source,dest,{concurrency=32,overwrite=false,filter=()=>true}={}){const cwdPath=process.cwd();const from=_path.default.resolve(cwdPath,source);const to=_path.default.resolve(cwdPath,dest);const sema=new _asyncSema.Sema(concurrency);async function _copy(item){const target=item.replace(from,to);const stats=await stat(item);await sema.acquire();if(stats.isDirectory()){try{await mkdir(target);}catch(err){// do not throw `folder already exists` errors
if(err.code!=='EEXIST'){throw err;}}sema.release();const files=await readdir(item);await Promise.all(files.map(file=>_copy(_path.default.join(item,file))));}else if(stats.isFile()&&// before we send the path to filter
// we remove the base path (from) and replace \ by / (windows)
filter(item.replace(from,'').replace(/\\/g,'/'))){await copyFile(item,target,overwrite?undefined:COPYFILE_EXCL);sema.release();}}await _copy(from);}