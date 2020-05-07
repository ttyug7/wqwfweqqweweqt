"use strict";exports.__esModule=true;exports.middleware=middleware;exports.NextScript=exports.Main=exports.Head=exports.Html=exports.default=void 0;var _propTypes=_interopRequireDefault(require("prop-types"));var _react=_interopRequireWildcard(require("react"));var _server=_interopRequireDefault(require("styled-jsx/server"));var _constants=require("../next-server/lib/constants");var _documentContext=require("../next-server/lib/document-context");var _utils=require("../next-server/lib/utils");exports.DocumentContext=_utils.DocumentContext;exports.DocumentInitialProps=_utils.DocumentInitialProps;exports.DocumentProps=_utils.DocumentProps;var _fid=_interopRequireDefault(require("../next-server/lib/fid"));var _utils2=require("../next-server/server/utils");var _htmlescape=require("../server/htmlescape");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}async function middleware({req,res}){}function dedupe(bundles){const files=new Set();const kept=[];for(const bundle of bundles){if(files.has(bundle.file))continue;files.add(bundle.file);kept.push(bundle);}return kept;}function getOptionalModernScriptVariant(path){if(process.env.__NEXT_MODERN_BUILD){return path.replace(/\.js$/,'.module.js');}return path;}/**
 * `Document` component handles the initial `document` markup and renders only on the server side.
 * Commonly used for implementing server side rendering for `css-in-js` libraries.
 */class Document extends _react.Component{/**
   * `getInitialProps` hook returns the context object with the addition of `renderPage`.
   * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
   */static async getInitialProps(ctx){const enhancers=process.env.__NEXT_PLUGINS?await Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=unstable-enhance-app-server!'))).then(mod=>mod.default(ctx)):[];const enhanceApp=App=>{for(const enhancer of enhancers){App=enhancer(App);}return props=>_react.default.createElement(App,props);};const{html,head}=await ctx.renderPage({enhanceApp});const styles=[...(0,_server.default)(),...(process.env.__NEXT_PLUGINS?await Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=unstable-get-styles-server!'))).then(mod=>mod.default(ctx)):[])];return{html,head,styles};}static renderDocument(Document,props){return _react.default.createElement(_documentContext.DocumentContext.Provider,{value:{_documentProps:props,// In dev we invalidate the cache by appending a timestamp to the resource URL.
// This is a workaround to fix https://github.com/zeit/next.js/issues/5860
// TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
_devOnlyInvalidateCacheQueryString:process.env.NODE_ENV!=='production'?'?ts='+Date.now():''}},_react.default.createElement(Document,props));}render(){return _react.default.createElement(Html,null,_react.default.createElement(Head,null),_react.default.createElement("body",null,_react.default.createElement(Main,null),_react.default.createElement(NextScript,null)));}}exports.default=Document;Document.headTagsMiddleware=process.env.__NEXT_PLUGINS?Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=document-head-tags-server!'))):()=>[];Document.bodyTagsMiddleware=process.env.__NEXT_PLUGINS?Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=document-body-tags-server!'))):()=>[];Document.htmlPropsMiddleware=process.env.__NEXT_PLUGINS?Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=document-html-props-server!'))):()=>[];class Html extends _react.Component{constructor(...args){super(...args);this.context=void 0;}render(){const{inAmpMode,htmlProps}=this.context._documentProps;return _react.default.createElement("html",Object.assign({},htmlProps,this.props,{amp:inAmpMode?'':undefined,"data-ampdevmode":inAmpMode&&process.env.NODE_ENV!=='production'?'':undefined}));}}exports.Html=Html;Html.contextType=_documentContext.DocumentContext;Html.propTypes={children:_propTypes.default.node.isRequired};class Head extends _react.Component{constructor(...args){super(...args);this.context=void 0;}getCssLinks(){const{assetPrefix,files}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;const cssFiles=files&&files.length?files.filter(f=>/\.css$/.test(f)):[];const cssLinkElements=[];cssFiles.forEach(file=>{cssLinkElements.push(_react.default.createElement("link",{key:`${file}-preload`,nonce:this.props.nonce,rel:"preload",href:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,as:"style",crossOrigin:this.props.crossOrigin||process.crossOrigin}),_react.default.createElement("link",{key:file,nonce:this.props.nonce,rel:"stylesheet",href:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,crossOrigin:this.props.crossOrigin||process.crossOrigin}));});return cssLinkElements.length===0?null:cssLinkElements;}getPreloadDynamicChunks(){const{dynamicImports,assetPrefix}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;return dedupe(dynamicImports).map(bundle=>{// `dynamicImports` will contain both `.js` and `.module.js` when the
// feature is enabled. This clause will filter down to the modern
// variants only.
if(!bundle.file.endsWith(getOptionalModernScriptVariant('.js'))){return null;}return _react.default.createElement("link",{rel:"preload",key:bundle.file,href:`${assetPrefix}/_next/${encodeURI(bundle.file)}${_devOnlyInvalidateCacheQueryString}`,as:"script",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin});})// Filter out nulled scripts
.filter(Boolean);}getPreloadMainLinks(){const{assetPrefix,files}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;const preloadFiles=files&&files.length?files.filter(file=>{// `dynamicImports` will contain both `.js` and `.module.js` when
// the feature is enabled. This clause will filter down to the
// modern variants only.
return file.endsWith(getOptionalModernScriptVariant('.js'));}):[];return!preloadFiles.length?null:preloadFiles.map(file=>_react.default.createElement("link",{key:file,nonce:this.props.nonce,rel:"preload",href:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,as:"script",crossOrigin:this.props.crossOrigin||process.crossOrigin}));}getFidPolyfill(){if(!process.env.__NEXT_FID_POLYFILL){return null;}return _react.default.createElement("script",{dangerouslySetInnerHTML:{__html:`(${_fid.default})(addEventListener, removeEventListener)`}});}render(){const{styles,ampPath,inAmpMode,assetPrefix,hybridAmp,canonicalBase,__NEXT_DATA__,dangerousAsPath,headTags,unstable_runtimeJS}=this.context._documentProps;const disableRuntimeJS=unstable_runtimeJS===false;const{_devOnlyInvalidateCacheQueryString}=this.context;const{page,buildId}=__NEXT_DATA__;let{head}=this.context._documentProps;let children=this.props.children;// show a warning if Head contains <title> (only in development)
if(process.env.NODE_ENV!=='production'){children=_react.default.Children.map(children,child=>{var _child$props;const isReactHelmet=child===null||child===void 0?void 0:(_child$props=child.props)===null||_child$props===void 0?void 0:_child$props['data-react-helmet'];if((child===null||child===void 0?void 0:child.type)==='title'&&!isReactHelmet){console.warn("Warning: <title> should not be used in _document.js's <Head>. https://err.sh/next.js/no-document-title");}return child;});if(this.props.crossOrigin)console.warn('Warning: `Head` attribute `crossOrigin` is deprecated. https://err.sh/next.js/doc-crossorigin-deprecated');}let hasAmphtmlRel=false;let hasCanonicalRel=false;// show warning and remove conflicting amp head tags
head=_react.default.Children.map(head||[],child=>{if(!child)return child;const{type,props}=child;if(inAmpMode){let badProp='';if(type==='meta'&&props.name==='viewport'){badProp='name="viewport"';}else if(type==='link'&&props.rel==='canonical'){hasCanonicalRel=true;}else if(type==='script'){// only block if
// 1. it has a src and isn't pointing to ampproject's CDN
// 2. it is using dangerouslySetInnerHTML without a type or
// a type of text/javascript
if(props.src&&props.src.indexOf('ampproject')<-1||props.dangerouslySetInnerHTML&&(!props.type||props.type==='text/javascript')){badProp='<script';Object.keys(props).forEach(prop=>{badProp+=` ${prop}="${props[prop]}"`;});badProp+='/>';}}if(badProp){console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://err.sh/next.js/conflicting-amp-tag`);return null;}}else{// non-amp mode
if(type==='link'&&props.rel==='amphtml'){hasAmphtmlRel=true;}}return child;});// try to parse styles from fragment for backwards compat
const curStyles=Array.isArray(styles)?styles:[];if(inAmpMode&&styles&&// @ts-ignore Property 'props' does not exist on type ReactElement
styles.props&&// @ts-ignore Property 'props' does not exist on type ReactElement
Array.isArray(styles.props.children)){const hasStyles=el=>{var _el$props,_el$props$dangerously;return el===null||el===void 0?void 0:(_el$props=el.props)===null||_el$props===void 0?void 0:(_el$props$dangerously=_el$props.dangerouslySetInnerHTML)===null||_el$props$dangerously===void 0?void 0:_el$props$dangerously.__html;};// @ts-ignore Property 'props' does not exist on type ReactElement
styles.props.children.forEach(child=>{if(Array.isArray(child)){child.forEach(el=>hasStyles(el)&&curStyles.push(el));}else if(hasStyles(child)){curStyles.push(child);}});}return _react.default.createElement("head",this.props,this.context._documentProps.isDevelopment&&_react.default.createElement(_react.default.Fragment,null,_react.default.createElement("style",{"data-next-hide-fouc":true,"data-ampdevmode":inAmpMode?'true':undefined,dangerouslySetInnerHTML:{__html:`body{display:none}`}}),_react.default.createElement("noscript",{"data-next-hide-fouc":true,"data-ampdevmode":inAmpMode?'true':undefined},_react.default.createElement("style",{dangerouslySetInnerHTML:{__html:`body{display:block}`}}))),children,head,_react.default.createElement("meta",{name:"next-head-count",content:_react.default.Children.count(head||[]).toString()}),inAmpMode&&_react.default.createElement(_react.default.Fragment,null,_react.default.createElement("meta",{name:"viewport",content:"width=device-width,minimum-scale=1,initial-scale=1"}),!hasCanonicalRel&&_react.default.createElement("link",{rel:"canonical",href:canonicalBase+(0,_utils2.cleanAmpPath)(dangerousAsPath)}),_react.default.createElement("link",{rel:"preload",as:"script",href:"https://cdn.ampproject.org/v0.js"}),styles&&_react.default.createElement("style",{"amp-custom":"",dangerouslySetInnerHTML:{__html:curStyles.map(style=>style.props.dangerouslySetInnerHTML.__html).join('').replace(/\/\*# sourceMappingURL=.*\*\//g,'').replace(/\/\*@ sourceURL=.*?\*\//g,'')}}),_react.default.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}}),_react.default.createElement("noscript",null,_react.default.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}})),_react.default.createElement("script",{async:true,src:"https://cdn.ampproject.org/v0.js"})),!inAmpMode&&_react.default.createElement(_react.default.Fragment,null,!hasAmphtmlRel&&hybridAmp&&_react.default.createElement("link",{rel:"amphtml",href:canonicalBase+getAmpPath(ampPath,dangerousAsPath)}),this.getCssLinks(),!disableRuntimeJS&&_react.default.createElement("link",{rel:"preload",href:assetPrefix+getOptionalModernScriptVariant(encodeURI(`/_next/static/${buildId}/pages/_app.js`))+_devOnlyInvalidateCacheQueryString,as:"script",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin}),!disableRuntimeJS&&page!=='/_error'&&_react.default.createElement("link",{rel:"preload",href:assetPrefix+getOptionalModernScriptVariant(encodeURI(`/_next/static/${buildId}/pages${getPageFile(page)}`))+_devOnlyInvalidateCacheQueryString,as:"script",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin}),!disableRuntimeJS&&this.getPreloadDynamicChunks(),!disableRuntimeJS&&this.getPreloadMainLinks(),this.context._documentProps.isDevelopment&&// this element is used to mount development styles so the
// ordering matches production
// (by default, style-loader injects at the bottom of <head />)
_react.default.createElement("noscript",{id:"__next_css__DO_NOT_USE__"}),styles||null),!disableRuntimeJS&&this.getFidPolyfill(),_react.default.createElement(_react.default.Fragment,{},...(headTags||[])));}}exports.Head=Head;Head.contextType=_documentContext.DocumentContext;Head.propTypes={nonce:_propTypes.default.string,crossOrigin:_propTypes.default.string};class Main extends _react.Component{constructor(...args){super(...args);this.context=void 0;}render(){const{inAmpMode,html}=this.context._documentProps;if(inAmpMode)return _constants.AMP_RENDER_TARGET;return _react.default.createElement("div",{id:"__next",dangerouslySetInnerHTML:{__html:html}});}}exports.Main=Main;Main.contextType=_documentContext.DocumentContext;class NextScript extends _react.Component{constructor(...args){super(...args);this.context=void 0;}getDynamicChunks(){const{dynamicImports,assetPrefix,files}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;return dedupe(dynamicImports).map(bundle=>{let modernProps={};if(process.env.__NEXT_MODERN_BUILD){modernProps=/\.module\.js$/.test(bundle.file)?{type:'module'}:{noModule:true};}if(!/\.js$/.test(bundle.file)||files.includes(bundle.file))return null;return _react.default.createElement("script",Object.assign({async:true,key:bundle.file,src:`${assetPrefix}/_next/${encodeURI(bundle.file)}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin},modernProps));});}getScripts(){const{assetPrefix,files,lowPriorityFiles}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;const normalScripts=files===null||files===void 0?void 0:files.filter(file=>file.endsWith('.js'));const lowPriorityScripts=lowPriorityFiles===null||lowPriorityFiles===void 0?void 0:lowPriorityFiles.filter(file=>file.endsWith('.js'));return[...normalScripts,...lowPriorityScripts].map(file=>{let modernProps={};if(process.env.__NEXT_MODERN_BUILD){modernProps=file.endsWith('.module.js')?{type:'module'}:{noModule:true};}return _react.default.createElement("script",Object.assign({key:file,src:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,async:true,crossOrigin:this.props.crossOrigin||process.crossOrigin},modernProps));});}getPolyfillScripts(){// polyfills.js has to be rendered as nomodule without async
// It also has to be the first script to load
const{assetPrefix,polyfillFiles}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;return polyfillFiles.filter(polyfill=>polyfill.endsWith('.js')&&!/\.module\.js$/.test(polyfill)).map(polyfill=>_react.default.createElement("script",{key:polyfill,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,noModule:true,src:`${assetPrefix}/_next/${polyfill}${_devOnlyInvalidateCacheQueryString}`}));}static getInlineScriptSource(documentProps){const{__NEXT_DATA__}=documentProps;try{const data=JSON.stringify(__NEXT_DATA__);return(0,_htmlescape.htmlEscapeJsonString)(data);}catch(err){if(err.message.indexOf('circular structure')){throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://err.sh/zeit/next.js/circular-structure`);}throw err;}}render(){const{staticMarkup,assetPrefix,inAmpMode,devFiles,__NEXT_DATA__,bodyTags,unstable_runtimeJS}=this.context._documentProps;const disableRuntimeJS=unstable_runtimeJS===false;const{_devOnlyInvalidateCacheQueryString}=this.context;if(inAmpMode){if(process.env.NODE_ENV==='production'){return null;}const devFiles=[_constants.CLIENT_STATIC_FILES_RUNTIME_AMP,_constants.CLIENT_STATIC_FILES_RUNTIME_WEBPACK];return _react.default.createElement(_react.default.Fragment,null,staticMarkup||disableRuntimeJS?null:_react.default.createElement("script",{id:"__NEXT_DATA__",type:"application/json",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,dangerouslySetInnerHTML:{__html:NextScript.getInlineScriptSource(this.context._documentProps)},"data-ampdevmode":true}),devFiles?devFiles.map(file=>_react.default.createElement("script",{key:file,src:`${assetPrefix}/_next/${file}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,"data-ampdevmode":true})):null,_react.default.createElement(_react.default.Fragment,{},...(bodyTags||[])));}const{page,buildId}=__NEXT_DATA__;if(process.env.NODE_ENV!=='production'){if(this.props.crossOrigin)console.warn('Warning: `NextScript` attribute `crossOrigin` is deprecated. https://err.sh/next.js/doc-crossorigin-deprecated');}const pageScript=[_react.default.createElement("script",Object.assign({async:true,"data-next-page":page,key:page,src:assetPrefix+encodeURI(`/_next/static/${buildId}/pages${getPageFile(page)}`)+_devOnlyInvalidateCacheQueryString,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin},process.env.__NEXT_MODERN_BUILD?{noModule:true}:{})),process.env.__NEXT_MODERN_BUILD&&_react.default.createElement("script",{async:true,"data-next-page":page,key:`${page}-modern`,src:assetPrefix+getOptionalModernScriptVariant(encodeURI(`/_next/static/${buildId}/pages${getPageFile(page)}`))+_devOnlyInvalidateCacheQueryString,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,type:"module"})];const appScript=[_react.default.createElement("script",Object.assign({async:true,"data-next-page":"/_app",src:assetPrefix+`/_next/static/${buildId}/pages/_app.js`+_devOnlyInvalidateCacheQueryString,key:"_app",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin},process.env.__NEXT_MODERN_BUILD?{noModule:true}:{})),process.env.__NEXT_MODERN_BUILD&&_react.default.createElement("script",{async:true,"data-next-page":"/_app",src:assetPrefix+`/_next/static/${buildId}/pages/_app.module.js`+_devOnlyInvalidateCacheQueryString,key:"_app-modern",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,type:"module"})];return _react.default.createElement(_react.default.Fragment,null,!disableRuntimeJS&&devFiles?devFiles.map(file=>!file.match(/\.js\.map/)&&_react.default.createElement("script",{key:file,src:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin})):null,staticMarkup||disableRuntimeJS?null:_react.default.createElement("script",{id:"__NEXT_DATA__",type:"application/json",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,dangerouslySetInnerHTML:{__html:NextScript.getInlineScriptSource(this.context._documentProps)}}),process.env.__NEXT_MODERN_BUILD&&!disableRuntimeJS?_react.default.createElement("script",{nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,noModule:true,dangerouslySetInnerHTML:{__html:NextScript.safariNomoduleFix}}):null,!disableRuntimeJS&&this.getPolyfillScripts(),!disableRuntimeJS&&appScript,!disableRuntimeJS&&page!=='/_error'&&pageScript,disableRuntimeJS||staticMarkup?null:this.getDynamicChunks(),disableRuntimeJS||staticMarkup?null:this.getScripts(),_react.default.createElement(_react.default.Fragment,{},...(bodyTags||[])));}}exports.NextScript=NextScript;NextScript.contextType=_documentContext.DocumentContext;NextScript.propTypes={nonce:_propTypes.default.string,crossOrigin:_propTypes.default.string};NextScript.safariNomoduleFix='!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';function getAmpPath(ampPath,asPath){return ampPath||`${asPath}${asPath.includes('?')?'&':'?'}amp=1`;}function getPageFile(page,buildId){const startingUrl=page==='/'?'/index':page;return buildId?`${startingUrl}.${buildId}.js`:`${startingUrl}.js`;}