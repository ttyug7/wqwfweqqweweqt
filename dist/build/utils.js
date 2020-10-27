"use strict";exports.__esModule=true;exports.collectPages=collectPages;exports.printTreeView=printTreeView;exports.printCustomRoutes=printCustomRoutes;exports.difference=difference;exports.getJsPageSizeInKb=getJsPageSizeInKb;exports.buildStaticPaths=buildStaticPaths;exports.isPageStatic=isPageStatic;exports.hasCustomGetInitialProps=hasCustomGetInitialProps;exports.getNamedExports=getNamedExports;require("../next-server/server/node-polyfill-fetch");var _chalk=_interopRequireDefault(require("next/dist/compiled/chalk"));var _gzipSize=_interopRequireDefault(require("next/dist/compiled/gzip-size"));var _textTable=_interopRequireDefault(require("next/dist/compiled/text-table"));var _path=_interopRequireDefault(require("path"));var _reactIs=require("react-is");var _stripAnsi=_interopRequireDefault(require("next/dist/compiled/strip-ansi"));var _constants=require("../lib/constants");var _prettyBytes=_interopRequireDefault(require("../lib/pretty-bytes"));var _recursiveReaddir=require("../lib/recursive-readdir");var _utils=require("../next-server/lib/router/utils");var _isDynamic=require("../next-server/lib/router/utils/is-dynamic");var _escapePathDelimiters=_interopRequireDefault(require("../next-server/lib/router/utils/escape-path-delimiters"));var _findPageFile=require("../server/lib/find-page-file");var _normalizePagePath=require("../next-server/server/normalize-page-path");var _normalizeTrailingSlash=require("../client/normalize-trailing-slash");var _normalizeLocalePath=require("../next-server/lib/i18n/normalize-locale-path");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const fileGzipStats={};const fsStatGzip=file=>{if(fileGzipStats[file])return fileGzipStats[file];fileGzipStats[file]=_gzipSize.default.file(file);return fileGzipStats[file];};function collectPages(directory,pageExtensions){return(0,_recursiveReaddir.recursiveReadDir)(directory,new RegExp(`\\.(?:${pageExtensions.join('|')})$`));}async function printTreeView(list,pageInfos,serverless,{distPath,buildId,pagesDir,pageExtensions,buildManifest,isModern,useStatic404}){const getPrettySize=_size=>{const size=(0,_prettyBytes.default)(_size);// green for 0-130kb
if(_size<130*1000)return _chalk.default.green(size);// yellow for 130-170kb
if(_size<170*1000)return _chalk.default.yellow(size);// red for >= 170kb
return _chalk.default.red.bold(size);};const getCleanName=fileName=>fileName// Trim off `static/`
.replace(/^static\//,'')// Re-add `static/` for root files
.replace(/^<buildId>/,'static')// Remove file hash
.replace(/[.-]([0-9a-z]{6})[0-9a-z]{14}(?=\.)/,'.$1');const messages=[['Page','Size','First Load JS'].map(entry=>_chalk.default.underline(entry))];const hasCustomApp=await(0,_findPageFile.findPageFile)(pagesDir,'/_app',pageExtensions);pageInfos.set('/404',{...(pageInfos.get('/404')||pageInfos.get('/_error')),static:useStatic404});if(!list.includes('/404')){list=[...list,'/404'];}const sizeData=await computeFromManifest(buildManifest,distPath,isModern,pageInfos);const pageList=list.slice().filter(e=>!(e==='/_document'||e==='/_error'||!hasCustomApp&&e==='/_app')).sort((a,b)=>a.localeCompare(b));pageList.forEach((item,i,arr)=>{var _buildManifest$pages$,_pageInfo$ssgPageRout;const symbol=i===0?arr.length===1?'─':'┌':i===arr.length-1?'└':'├';const pageInfo=pageInfos.get(item);const ampFirst=buildManifest.ampFirstPages.includes(item);messages.push([`${symbol} ${item==='/_app'?' ':(pageInfo==null?void 0:pageInfo.static)?'○':(pageInfo==null?void 0:pageInfo.isSsg)?'●':'λ'} ${(pageInfo==null?void 0:pageInfo.initialRevalidateSeconds)?`${item} (ISR: ${pageInfo==null?void 0:pageInfo.initialRevalidateSeconds} Seconds)`:item}`,pageInfo?ampFirst?_chalk.default.cyan('AMP'):pageInfo.size>=0?(0,_prettyBytes.default)(pageInfo.size):'':'',pageInfo?ampFirst?_chalk.default.cyan('AMP'):pageInfo.size>=0?getPrettySize(pageInfo.totalSize):'':'']);const uniqueCssFiles=((_buildManifest$pages$=buildManifest.pages[item])==null?void 0:_buildManifest$pages$.filter(file=>file.endsWith('.css')&&sizeData.uniqueFiles.includes(file)))||[];if(uniqueCssFiles.length>0){const contSymbol=i===arr.length-1?' ':'├';uniqueCssFiles.forEach((file,index,{length})=>{const innerSymbol=index===length-1?'└':'├';messages.push([`${contSymbol}   ${innerSymbol} ${getCleanName(file)}`,(0,_prettyBytes.default)(sizeData.sizeUniqueFiles[file]),'']);});}if(pageInfo==null?void 0:(_pageInfo$ssgPageRout=pageInfo.ssgPageRoutes)==null?void 0:_pageInfo$ssgPageRout.length){const totalRoutes=pageInfo.ssgPageRoutes.length;const previewPages=totalRoutes===4?4:3;const contSymbol=i===arr.length-1?' ':'├';const routes=pageInfo.ssgPageRoutes.slice(0,previewPages);if(totalRoutes>previewPages){const remaining=totalRoutes-previewPages;routes.push(`[+${remaining} more paths]`);}routes.forEach((slug,index,{length})=>{const innerSymbol=index===length-1?'└':'├';messages.push([`${contSymbol}   ${innerSymbol} ${slug}`,'','']);});}});const sharedFilesSize=sizeData.sizeCommonFiles;const sharedFiles=sizeData.sizeCommonFile;messages.push(['+ First Load JS shared by all',getPrettySize(sharedFilesSize),'']);const sharedFileKeys=Object.keys(sharedFiles);const sharedCssFiles=[];[...sharedFileKeys.filter(file=>{if(file.endsWith('.css')){sharedCssFiles.push(file);return false;}return true;}).map(e=>e.replace(buildId,'<buildId>')).sort(),...sharedCssFiles.map(e=>e.replace(buildId,'<buildId>')).sort()].forEach((fileName,index,{length})=>{const innerSymbol=index===length-1?'└':'├';const originalName=fileName.replace('<buildId>',buildId);const cleanName=getCleanName(fileName);messages.push([`  ${innerSymbol} ${cleanName}`,(0,_prettyBytes.default)(sharedFiles[originalName]),'']);});console.log((0,_textTable.default)(messages,{align:['l','l','r'],stringLength:str=>(0,_stripAnsi.default)(str).length}));console.log();console.log((0,_textTable.default)([['λ',serverless?'(Lambda)':'(Server)',`server-side renders at runtime (uses ${_chalk.default.cyan('getInitialProps')} or ${_chalk.default.cyan('getServerSideProps')})`],['○','(Static)','automatically rendered as static HTML (uses no initial props)'],['●','(SSG)',`automatically generated as static HTML + JSON (uses ${_chalk.default.cyan('getStaticProps')})`],['','(ISR)',`incremental static regeneration (uses revalidate in ${_chalk.default.cyan('getStaticProps')})`]],{align:['l','l','l'],stringLength:str=>(0,_stripAnsi.default)(str).length}));console.log();}function printCustomRoutes({redirects,rewrites,headers}){const printRoutes=(routes,type)=>{const isRedirects=type==='Redirects';const isHeaders=type==='Headers';console.log(_chalk.default.underline(type));console.log();/*
        ┌ source
        ├ permanent/statusCode
        └ destination
     */const routesStr=routes.map(route=>{let routeStr=`┌ source: ${route.source}\n`;if(!isHeaders){const r=route;routeStr+=`${isRedirects?'├':'└'} destination: ${r.destination}\n`;}if(isRedirects){const r=route;routeStr+=`└ ${r.statusCode?`status: ${r.statusCode}`:`permanent: ${r.permanent}`}\n`;}if(isHeaders){const r=route;routeStr+=`└ headers:\n`;for(let i=0;i<r.headers.length;i++){const header=r.headers[i];const last=i===headers.length-1;routeStr+=`  ${last?'└':'├'} ${header.key}: ${header.value}\n`;}}return routeStr;}).join('\n');console.log(routesStr,'\n');};if(redirects.length){printRoutes(redirects,'Redirects');}if(rewrites.length){printRoutes(rewrites,'Rewrites');}if(headers.length){printRoutes(headers,'Headers');}}let cachedBuildManifest;let lastCompute;let lastComputeModern;let lastComputePageInfo;async function computeFromManifest(manifest,distPath,isModern,pageInfos){if(Object.is(cachedBuildManifest,manifest)&&lastComputeModern===isModern&&lastComputePageInfo===!!pageInfos){return lastCompute;}let expected=0;const files=new Map();Object.keys(manifest.pages).forEach(key=>{if(pageInfos){const pageInfo=pageInfos.get(key);// don't include AMP pages since they don't rely on shared bundles
// AMP First pages are not under the pageInfos key
if(pageInfo==null?void 0:pageInfo.isHybridAmp){return;}}++expected;manifest.pages[key].forEach(file=>{if(// Select Modern or Legacy scripts
file.endsWith('.module.js')!==isModern){return;}if(key==='/_app'){files.set(file,Infinity);}else if(files.has(file)){files.set(file,files.get(file)+1);}else{files.set(file,1);}});});const commonFiles=[...files.entries()].filter(([,len])=>len===expected||len===Infinity).map(([f])=>f);const uniqueFiles=[...files.entries()].filter(([,len])=>len===1).map(([f])=>f);let stats;try{stats=await Promise.all(commonFiles.map(async f=>[f,await fsStatGzip(_path.default.join(distPath,f))]));}catch(_){stats=[];}let uniqueStats;try{uniqueStats=await Promise.all(uniqueFiles.map(async f=>[f,await fsStatGzip(_path.default.join(distPath,f))]));}catch(_){uniqueStats=[];}lastCompute={commonFiles,uniqueFiles,sizeUniqueFiles:uniqueStats.reduce((obj,n)=>Object.assign(obj,{[n[0]]:n[1]}),{}),sizeCommonFile:stats.reduce((obj,n)=>Object.assign(obj,{[n[0]]:n[1]}),{}),sizeCommonFiles:stats.reduce((size,[f,stat])=>{if(f.endsWith('.css'))return size;return size+stat;},0)};cachedBuildManifest=manifest;lastComputeModern=isModern;lastComputePageInfo=!!pageInfos;return lastCompute;}function difference(main,sub){const a=new Set(main);const b=new Set(sub);return[...a].filter(x=>!b.has(x));}function intersect(main,sub){const a=new Set(main);const b=new Set(sub);return[...new Set([...a].filter(x=>b.has(x)))];}function sum(a){return a.reduce((size,stat)=>size+stat,0);}async function getJsPageSizeInKb(page,distPath,buildManifest,isModern){const data=await computeFromManifest(buildManifest,distPath,isModern);const fnFilterModern=entry=>entry.endsWith('.js')&&entry.endsWith('.module.js')===isModern;const pageFiles=(buildManifest.pages[(0,_normalizePagePath.denormalizePagePath)(page)]||[]).filter(fnFilterModern);const appFiles=(buildManifest.pages['/_app']||[]).filter(fnFilterModern);const fnMapRealPath=dep=>`${distPath}/${dep}`;const allFilesReal=[...new Set([...pageFiles,...appFiles])].map(fnMapRealPath);const selfFilesReal=difference(intersect(pageFiles,data.uniqueFiles),data.commonFiles).map(fnMapRealPath);try{// Doesn't use `Promise.all`, as we'd double compute duplicate files. This
// function is memoized, so the second one will instantly resolve.
const allFilesSize=sum(await Promise.all(allFilesReal.map(fsStatGzip)));const selfFilesSize=sum(await Promise.all(selfFilesReal.map(fsStatGzip)));return[selfFilesSize,allFilesSize];}catch(_){}return[-1,-1];}async function buildStaticPaths(page,getStaticPaths,locales,defaultLocale){const prerenderPaths=new Set();const _routeRegex=(0,_utils.getRouteRegex)(page);const _routeMatcher=(0,_utils.getRouteMatcher)(_routeRegex);// Get the default list of allowed params.
const _validParamKeys=Object.keys(_routeMatcher(page));const staticPathsResult=await getStaticPaths({locales,defaultLocale});const expectedReturnVal=`Expected: { paths: [], fallback: boolean }\n`+`See here for more info: https://err.sh/vercel/next.js/invalid-getstaticpaths-value`;if(!staticPathsResult||typeof staticPathsResult!=='object'||Array.isArray(staticPathsResult)){throw new Error(`Invalid value returned from getStaticPaths in ${page}. Received ${typeof staticPathsResult} ${expectedReturnVal}`);}const invalidStaticPathKeys=Object.keys(staticPathsResult).filter(key=>!(key==='paths'||key==='fallback'));if(invalidStaticPathKeys.length>0){throw new Error(`Extra keys returned from getStaticPaths in ${page} (${invalidStaticPathKeys.join(', ')}) ${expectedReturnVal}`);}if(!(typeof staticPathsResult.fallback==='boolean'||staticPathsResult.fallback==='blocking')){throw new Error(`The \`fallback\` key must be returned from getStaticPaths in ${page}.\n`+expectedReturnVal);}const toPrerender=staticPathsResult.paths;if(!Array.isArray(toPrerender)){throw new Error(`Invalid \`paths\` value returned from getStaticProps in ${page}.\n`+`\`paths\` must be an array of strings or objects of shape { params: [key: string]: string }`);}toPrerender.forEach(entry=>{// For a string-provided path, we must make sure it matches the dynamic
// route.
if(typeof entry==='string'){entry=(0,_normalizeTrailingSlash.removePathTrailingSlash)(entry);const localePathResult=(0,_normalizeLocalePath.normalizeLocalePath)(entry,locales);let cleanedEntry=entry;if(localePathResult.detectedLocale){cleanedEntry=entry.substr(localePathResult.detectedLocale.length+1);}else if(defaultLocale){entry=`/${defaultLocale}${entry}`;}const result=_routeMatcher(cleanedEntry);if(!result){throw new Error(`The provided path \`${entry}\` does not match the page: \`${page}\`.`);}prerenderPaths==null?void 0:prerenderPaths.add(entry);}// For the object-provided path, we must make sure it specifies all
// required keys.
else{const invalidKeys=Object.keys(entry).filter(key=>key!=='params'&&key!=='locale');if(invalidKeys.length){throw new Error(`Additional keys were returned from \`getStaticPaths\` in page "${page}". `+`URL Parameters intended for this dynamic route must be nested under the \`params\` key, i.e.:`+`\n\n\treturn { params: { ${_validParamKeys.map(k=>`${k}: ...`).join(', ')} } }`+`\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.\n`);}const{params={}}=entry;let builtPage=page;_validParamKeys.forEach(validParamKey=>{const{repeat,optional}=_routeRegex.groups[validParamKey];let paramValue=params[validParamKey];if(optional&&params.hasOwnProperty(validParamKey)&&(paramValue===null||paramValue===undefined||paramValue===false)){paramValue=[];}if(repeat&&!Array.isArray(paramValue)||!repeat&&typeof paramValue!=='string'){throw new Error(`A required parameter (${validParamKey}) was not provided as ${repeat?'an array':'a string'} in getStaticPaths for ${page}`);}let replaced=`[${repeat?'...':''}${validParamKey}]`;if(optional){replaced=`[${replaced}]`;}builtPage=builtPage.replace(replaced,repeat?paramValue.map(_escapePathDelimiters.default).join('/'):(0,_escapePathDelimiters.default)(paramValue)).replace(/(?!^)\/$/,'');});if(entry.locale&&!(locales==null?void 0:locales.includes(entry.locale))){throw new Error(`Invalid locale returned from getStaticPaths for ${page}, the locale ${entry.locale} is not specified in next.config.js`);}const curLocale=entry.locale||defaultLocale||'';prerenderPaths==null?void 0:prerenderPaths.add(`${curLocale?`/${curLocale}`:''}${builtPage}`);}});return{paths:[...prerenderPaths],fallback:staticPathsResult.fallback};}async function isPageStatic(page,serverBundle,runtimeEnvConfig,locales,defaultLocale){try{require('../next-server/lib/runtime-config').setConfig(runtimeEnvConfig);const mod=await require(serverBundle);const Comp=await(mod.default||mod);if(!Comp||!(0,_reactIs.isValidElementType)(Comp)||typeof Comp==='string'){throw new Error('INVALID_DEFAULT_EXPORT');}const hasGetInitialProps=!!Comp.getInitialProps;const hasStaticProps=!!(await mod.getStaticProps);const hasStaticPaths=!!(await mod.getStaticPaths);const hasServerProps=!!(await mod.getServerSideProps);const hasLegacyServerProps=!!(await mod.unstable_getServerProps);const hasLegacyStaticProps=!!(await mod.unstable_getStaticProps);const hasLegacyStaticPaths=!!(await mod.unstable_getStaticPaths);const hasLegacyStaticParams=!!(await mod.unstable_getStaticParams);if(hasLegacyStaticParams){throw new Error(`unstable_getStaticParams was replaced with getStaticPaths. Please update your code.`);}if(hasLegacyStaticPaths){throw new Error(`unstable_getStaticPaths was replaced with getStaticPaths. Please update your code.`);}if(hasLegacyStaticProps){throw new Error(`unstable_getStaticProps was replaced with getStaticProps. Please update your code.`);}if(hasLegacyServerProps){throw new Error(`unstable_getServerProps was replaced with getServerSideProps. Please update your code.`);}// A page cannot be prerendered _and_ define a data requirement. That's
// contradictory!
if(hasGetInitialProps&&hasStaticProps){throw new Error(_constants.SSG_GET_INITIAL_PROPS_CONFLICT);}if(hasGetInitialProps&&hasServerProps){throw new Error(_constants.SERVER_PROPS_GET_INIT_PROPS_CONFLICT);}if(hasStaticProps&&hasServerProps){throw new Error(_constants.SERVER_PROPS_SSG_CONFLICT);}const pageIsDynamic=(0,_isDynamic.isDynamicRoute)(page);// A page cannot have static parameters if it is not a dynamic page.
if(hasStaticProps&&hasStaticPaths&&!pageIsDynamic){throw new Error(`getStaticPaths can only be used with dynamic pages, not '${page}'.`+`\nLearn more: https://nextjs.org/docs/routing/dynamic-routes`);}if(hasStaticProps&&pageIsDynamic&&!hasStaticPaths){throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${page}'.`+`\nRead more: https://err.sh/next.js/invalid-getstaticpaths-value`);}let prerenderRoutes;let prerenderFallback;if(hasStaticProps&&hasStaticPaths){;({paths:prerenderRoutes,fallback:prerenderFallback}=await buildStaticPaths(page,mod.getStaticPaths,locales,defaultLocale));}const config=mod.config||{};return{isStatic:!hasStaticProps&&!hasGetInitialProps&&!hasServerProps,isHybridAmp:config.amp==='hybrid',isAmpOnly:config.amp===true,prerenderRoutes,prerenderFallback,hasStaticProps,hasServerProps};}catch(err){if(err.code==='MODULE_NOT_FOUND')return{};throw err;}}async function hasCustomGetInitialProps(bundle,runtimeEnvConfig,checkingApp){require('../next-server/lib/runtime-config').setConfig(runtimeEnvConfig);let mod=require(bundle);if(checkingApp){mod=(await mod._app)||mod.default||mod;}else{mod=mod.default||mod;}mod=await mod;return mod.getInitialProps!==mod.origGetInitialProps;}function getNamedExports(bundle,runtimeEnvConfig){require('../next-server/lib/runtime-config').setConfig(runtimeEnvConfig);return Object.keys(require(bundle));}
//# sourceMappingURL=utils.js.map