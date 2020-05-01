"use strict";exports.__esModule=true;exports.NextJsRequireCacheHotReloader=void 0;var _fs=require("fs");function deleteCache(path){try{delete require.cache[(0,_fs.realpathSync)(path)];}catch(e){if(e.code!=='ENOENT')throw e;}finally{delete require.cache[path];}}// This plugin flushes require.cache after emitting the files. Providing 'hot reloading' of server files.
class NextJsRequireCacheHotReloader{constructor(){this.prevAssets=null;}apply(compiler){compiler.hooks.afterEmit.tapAsync('NextJsRequireCacheHotReloader',(compilation,callback)=>{const{assets}=compilation;if(this.prevAssets){for(const f of Object.keys(assets)){deleteCache(assets[f].existsAt);}for(const f of Object.keys(this.prevAssets)){if(!assets[f]){deleteCache(this.prevAssets[f].existsAt);}}}this.prevAssets=assets;callback();});}}exports.NextJsRequireCacheHotReloader=NextJsRequireCacheHotReloader;