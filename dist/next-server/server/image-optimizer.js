"use strict";exports.__esModule=true;exports.imageOptimizer=imageOptimizer;exports.getMaxAge=getMaxAge;var _accept=require("@hapi/accept");var _crypto=require("crypto");var _fs=require("fs");var _getOrientation=require("get-orientation");var _isAnimated=_interopRequireDefault(require("next/dist/compiled/is-animated"));var _path=require("path");var _stream=_interopRequireDefault(require("stream"));var _url=_interopRequireDefault(require("url"));var _fileExists=require("../../lib/file-exists");var _imageConfig=require("./image-config");var _main=require("./lib/squoosh/main");var _sendPayload=require("./send-payload");var _serveStatic=require("./serve-static");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// @ts-ignore no types for is-animated
//const AVIF = 'image/avif'
const WEBP='image/webp';const PNG='image/png';const JPEG='image/jpeg';const GIF='image/gif';const SVG='image/svg+xml';const CACHE_VERSION=2;const MODERN_TYPES=[/* AVIF, */WEBP];const ANIMATABLE_TYPES=[WEBP,PNG,GIF];const VECTOR_TYPES=[SVG];async function imageOptimizer(server,req,res,parsedUrl){var _upstreamType;const{nextConfig,distDir}=server;const imageData=nextConfig.images||_imageConfig.imageConfigDefault;const{deviceSizes=[],imageSizes=[],domains=[],loader}=imageData;if(loader!=='default'){await server.render404(req,res,parsedUrl);return{finished:true};}const{headers}=req;const{url,w,q}=parsedUrl.query;const mimeType=getSupportedMimeType(MODERN_TYPES,headers.accept);let href;if(!url){res.statusCode=400;res.end('"url" parameter is required');return{finished:true};}else if(Array.isArray(url)){res.statusCode=400;res.end('"url" parameter cannot be an array');return{finished:true};}let isAbsolute;if(url.startsWith('/')){href=url;isAbsolute=false;}else{let hrefParsed;try{hrefParsed=new URL(url);href=hrefParsed.toString();isAbsolute=true;}catch(_error){res.statusCode=400;res.end('"url" parameter is invalid');return{finished:true};}if(!['http:','https:'].includes(hrefParsed.protocol)){res.statusCode=400;res.end('"url" parameter is invalid');return{finished:true};}if(!domains.includes(hrefParsed.hostname)){res.statusCode=400;res.end('"url" parameter is not allowed');return{finished:true};}}if(!w){res.statusCode=400;res.end('"w" parameter (width) is required');return{finished:true};}else if(Array.isArray(w)){res.statusCode=400;res.end('"w" parameter (width) cannot be an array');return{finished:true};}if(!q){res.statusCode=400;res.end('"q" parameter (quality) is required');return{finished:true};}else if(Array.isArray(q)){res.statusCode=400;res.end('"q" parameter (quality) cannot be an array');return{finished:true};}const width=parseInt(w,10);if(!width||isNaN(width)){res.statusCode=400;res.end('"w" parameter (width) must be a number greater than 0');return{finished:true};}const sizes=[...deviceSizes,...imageSizes];if(!sizes.includes(width)){res.statusCode=400;res.end(`"w" parameter (width) of ${width} is not allowed`);return{finished:true};}const quality=parseInt(q);if(isNaN(quality)||quality<1||quality>100){res.statusCode=400;res.end('"q" parameter (quality) must be a number between 1 and 100');return{finished:true};}const hash=getHash([CACHE_VERSION,href,width,quality,mimeType]);const imagesDir=(0,_path.join)(distDir,'cache','images');const hashDir=(0,_path.join)(imagesDir,hash);const now=Date.now();if(await(0,_fileExists.fileExists)(hashDir,'directory')){const files=await _fs.promises.readdir(hashDir);for(let file of files){const[prefix,etag,extension]=file.split('.');const expireAt=Number(prefix);const contentType=(0,_serveStatic.getContentType)(extension);const fsPath=(0,_path.join)(hashDir,file);if(now<expireAt){res.setHeader('Cache-Control','public, max-age=0, must-revalidate');if((0,_sendPayload.sendEtagResponse)(req,res,etag)){return{finished:true};}if(contentType){res.setHeader('Content-Type',contentType);}(0,_fs.createReadStream)(fsPath).pipe(res);return{finished:true};}else{await _fs.promises.unlink(fsPath);}}}let upstreamBuffer;let upstreamType;let maxAge;if(isAbsolute){const upstreamRes=await fetch(href);if(!upstreamRes.ok){res.statusCode=upstreamRes.status;res.end('"url" parameter is valid but upstream response is invalid');return{finished:true};}res.statusCode=upstreamRes.status;upstreamBuffer=Buffer.from(await upstreamRes.arrayBuffer());upstreamType=upstreamRes.headers.get('Content-Type');maxAge=getMaxAge(upstreamRes.headers.get('Cache-Control'));}else{try{const _req={headers:req.headers,method:req.method,url:href};const resBuffers=[];const mockRes=new _stream.default.Writable();mockRes.write=chunk=>{resBuffers.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk));};mockRes._write=chunk=>{mockRes.write(chunk);};const mockHeaders={};mockRes.writeHead=(_status,_headers)=>Object.assign(mockHeaders,_headers);mockRes.getHeader=name=>mockHeaders[name.toLowerCase()];mockRes.getHeaders=()=>mockHeaders;mockRes.getHeaderNames=()=>Object.keys(mockHeaders);mockRes.setHeader=(name,value)=>mockHeaders[name.toLowerCase()]=value;mockRes._implicitHeader=()=>{};mockRes.finished=false;mockRes.statusCode=200;await server.getRequestHandler()(_req,mockRes,_url.default.parse(href,true));res.statusCode=mockRes.statusCode;upstreamBuffer=Buffer.concat(resBuffers);upstreamType=mockRes.getHeader('Content-Type');maxAge=getMaxAge(mockRes.getHeader('Cache-Control'));}catch(err){res.statusCode=500;res.end('"url" parameter is valid but upstream response is invalid');return{finished:true};}}const expireAt=maxAge*1000+now;if(upstreamType){const vector=VECTOR_TYPES.includes(upstreamType);const animate=ANIMATABLE_TYPES.includes(upstreamType)&&(0,_isAnimated.default)(upstreamBuffer);if(vector||animate){await writeToCacheDir(hashDir,upstreamType,expireAt,upstreamBuffer);sendResponse(req,res,upstreamType,upstreamBuffer);return{finished:true};}// If upstream type is not a valid image type, return 400 error.
if(!upstreamType.startsWith('image/')){res.statusCode=400;res.end("The requested resource isn't a valid image.");return{finished:true};}}let contentType;if(mimeType){contentType=mimeType;}else if((_upstreamType=upstreamType)!=null&&_upstreamType.startsWith('image/')&&(0,_serveStatic.getExtension)(upstreamType)){contentType=upstreamType;}else{contentType=JPEG;}try{const orientation=await(0,_getOrientation.getOrientation)(upstreamBuffer);const operations=[];if(orientation===_getOrientation.Orientation.RIGHT_TOP){operations.push({type:'rotate',numRotations:1});}else if(orientation===_getOrientation.Orientation.BOTTOM_RIGHT){operations.push({type:'rotate',numRotations:2});}else if(orientation===_getOrientation.Orientation.LEFT_BOTTOM){operations.push({type:'rotate',numRotations:3});}else{// TODO: support more orientations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const _: never = orientation
}operations.push({type:'resize',width});let optimizedBuffer;//if (contentType === AVIF) {
//} else
if(contentType===WEBP){optimizedBuffer=await(0,_main.processBuffer)(upstreamBuffer,operations,'webp',quality);}else if(contentType===PNG){optimizedBuffer=await(0,_main.processBuffer)(upstreamBuffer,operations,'png',quality);}else if(contentType===JPEG){optimizedBuffer=await(0,_main.processBuffer)(upstreamBuffer,operations,'jpeg',quality);}if(optimizedBuffer){await writeToCacheDir(hashDir,contentType,expireAt,optimizedBuffer);sendResponse(req,res,contentType,optimizedBuffer);}else{throw new Error('Unable to optimize buffer');}}catch(error){sendResponse(req,res,upstreamType,upstreamBuffer);}return{finished:true};}async function writeToCacheDir(dir,contentType,expireAt,buffer){await _fs.promises.mkdir(dir,{recursive:true});const extension=(0,_serveStatic.getExtension)(contentType);const etag=getHash([buffer]);const filename=(0,_path.join)(dir,`${expireAt}.${etag}.${extension}`);await _fs.promises.writeFile(filename,buffer);}function sendResponse(req,res,contentType,buffer){const etag=getHash([buffer]);res.setHeader('Cache-Control','public, max-age=0, must-revalidate');if((0,_sendPayload.sendEtagResponse)(req,res,etag)){return;}if(contentType){res.setHeader('Content-Type',contentType);}res.end(buffer);}function getSupportedMimeType(options,accept=''){const mimeType=(0,_accept.mediaType)(accept,options);return accept.includes(mimeType)?mimeType:'';}function getHash(items){const hash=(0,_crypto.createHash)('sha256');for(let item of items){if(typeof item==='number')hash.update(String(item));else{hash.update(item);}}// See https://en.wikipedia.org/wiki/Base64#Filenames
return hash.digest('base64').replace(/\//g,'-');}function parseCacheControl(str){const map=new Map();if(!str){return map;}for(let directive of str.split(',')){let[key,value]=directive.trim().split('=');key=key.toLowerCase();if(value){value=value.toLowerCase();}map.set(key,value);}return map;}function getMaxAge(str){const minimum=60;const map=parseCacheControl(str);if(map){let age=map.get('s-maxage')||map.get('max-age')||'';if(age.startsWith('"')&&age.endsWith('"')){age=age.slice(1,-1);}const n=parseInt(age,10);if(!isNaN(n)){return Math.max(n,minimum);}}return minimum;}
//# sourceMappingURL=image-optimizer.js.map