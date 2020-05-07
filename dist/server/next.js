"use strict";exports.__esModule=true;exports.default=void 0;var _nextServer=_interopRequireDefault(require("../next-server/server/next-server"));var _constants=require("../lib/constants");var log=_interopRequireWildcard(require("../build/output/log"));function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// This file is used for when users run `require('next')`
function createServer(options){const standardEnv=['production','development','test'];if(!options.isNextDevCommand&&process.env.NODE_ENV&&!standardEnv.includes(process.env.NODE_ENV)){log.warn(_constants.NON_STANDARD_NODE_ENV);}if(options.dev){const Server=require('./next-dev-server').default;return new Server(options);}return new _nextServer.default(options);}// Support commonjs `require('next')`
module.exports=createServer;exports=module.exports;// Support `import next from 'next'`
var _default=createServer;exports.default=_default;