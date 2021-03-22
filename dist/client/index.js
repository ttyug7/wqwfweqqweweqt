"use strict";var _interopRequireWildcard3=require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");exports.__esModule=true;exports.render=render;exports.renderError=renderError;exports.default=exports.emitter=exports.router=exports.version=void 0;var _extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends"));var _interopRequireWildcard2=_interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));require("@next/polyfill-module");var _react=_interopRequireDefault(require("react"));var _reactDom=_interopRequireDefault(require("react-dom"));var _headManagerContext=require("../next-server/lib/head-manager-context");var _mitt=_interopRequireDefault(require("../next-server/lib/mitt"));var _routerContext=require("../next-server/lib/router-context");var _router=require("../next-server/lib/router/router");var _isDynamic=require("../next-server/lib/router/utils/is-dynamic");var querystring=_interopRequireWildcard3(require("../next-server/lib/router/utils/querystring"));var envConfig=_interopRequireWildcard3(require("../next-server/lib/runtime-config"));var _utils=require("../next-server/lib/utils");var _portal=require("./portal");var _headManager=_interopRequireDefault(require("./head-manager"));var _pageLoader=_interopRequireDefault(require("./page-loader"));var _performanceRelayer=_interopRequireDefault(require("./performance-relayer"));var _routeAnnouncer=require("./route-announcer");var _router2=require("./router");/* global location */const data=JSON.parse(document.getElementById('__NEXT_DATA__').textContent);window.__NEXT_DATA__=data;const version="10.0.10-canary.6";exports.version=version;const looseToArray=input=>[].slice.call(input);const{props:hydrateProps,err:hydrateErr,page,query,buildId,assetPrefix,runtimeConfig,dynamicIds,isFallback,locale,locales,domainLocales,isPreview}=data;let{defaultLocale}=data;const prefix=assetPrefix||'';// With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
// So, this is how we do it in the client side at runtime
__webpack_public_path__=`${prefix}/_next/`;//eslint-disable-line
// Initialize next/config with the environment configuration
envConfig.setConfig({serverRuntimeConfig:{},publicRuntimeConfig:runtimeConfig||{}});let asPath=(0,_utils.getURL)();// make sure not to attempt stripping basePath for 404s
if((0,_router.hasBasePath)(asPath)){asPath=(0,_router.delBasePath)(asPath);}if(process.env.__NEXT_I18N_SUPPORT){const{normalizeLocalePath}=require('../next-server/lib/i18n/normalize-locale-path');const{detectDomainLocale}=require('../next-server/lib/i18n/detect-domain-locale');const{parseRelativeUrl}=require('../next-server/lib/router/utils/parse-relative-url');const{formatUrl}=require('../next-server/lib/router/utils/format-url');if(locales){const parsedAs=parseRelativeUrl(asPath);const localePathResult=normalizeLocalePath(parsedAs.pathname,locales);if(localePathResult.detectedLocale){parsedAs.pathname=localePathResult.pathname;asPath=formatUrl(parsedAs);}else{// derive the default locale if it wasn't detected in the asPath
// since we don't prerender static pages with all possible default
// locales
defaultLocale=locale;}// attempt detecting default locale based on hostname
const detectedDomain=detectDomainLocale(process.env.__NEXT_I18N_DOMAINS,window.location.hostname);// TODO: investigate if defaultLocale needs to be populated after
// hydration to prevent mismatched renders
if(detectedDomain){defaultLocale=detectedDomain.defaultLocale;}}}if(process.env.__NEXT_SCRIPT_LOADER&&data.scriptLoader){const{initScriptLoader}=require('./experimental-script');initScriptLoader(data.scriptLoader);}const pageLoader=new _pageLoader.default(buildId,prefix);const register=([r,f])=>pageLoader.routeLoader.onEntrypoint(r,f);if(window.__NEXT_P){// Defer page registration for another tick. This will increase the overall
// latency in hydrating the page, but reduce the total blocking time.
window.__NEXT_P.map(p=>setTimeout(()=>register(p),0));}window.__NEXT_P=[];window.__NEXT_P.push=register;const headManager=(0,_headManager.default)();const appElement=document.getElementById('__next');let lastRenderReject;let webpackHMR;let router;exports.router=router;let CachedApp,onPerfEntry;class Container extends _react.default.Component{componentDidCatch(componentErr,info){this.props.fn(componentErr,info);}componentDidMount(){this.scrollToHash();// We need to replace the router state if:
// - the page was (auto) exported and has a query string or search (hash)
// - it was auto exported and is a dynamic route (to provide params)
// - if it is a client-side skeleton (fallback render)
if(router.isSsr&&(isFallback||data.nextExport&&((0,_isDynamic.isDynamicRoute)(router.pathname)||location.search)||hydrateProps&&hydrateProps.__N_SSG&&location.search)){// update query on mount for exported pages
router.replace(router.pathname+'?'+String(querystring.assign(querystring.urlQueryToSearchParams(router.query),new URLSearchParams(location.search))),asPath,{// @ts-ignore
// WARNING: `_h` is an internal option for handing Next.js
// client-side hydration. Your app should _never_ use this property.
// It may change at any time without notice.
_h:1,// Fallback pages must trigger the data fetch, so the transition is
// not shallow.
// Other pages (strictly updating query) happens shallowly, as data
// requirements would already be present.
shallow:!isFallback});}}componentDidUpdate(){this.scrollToHash();}scrollToHash(){let{hash}=location;hash=hash&&hash.substring(1);if(!hash)return;const el=document.getElementById(hash);if(!el)return;// If we call scrollIntoView() in here without a setTimeout
// it won't scroll properly.
setTimeout(()=>el.scrollIntoView(),0);}render(){if(process.env.NODE_ENV==='production'){return this.props.children;}else{const{ReactDevOverlay}=require('@next/react-dev-overlay/lib/client');return/*#__PURE__*/_react.default.createElement(ReactDevOverlay,null,this.props.children);}}}const emitter=(0,_mitt.default)();exports.emitter=emitter;let CachedComponent;var _default=async(opts={})=>{// This makes sure this specific lines are removed in production
if(process.env.NODE_ENV==='development'){webpackHMR=opts.webpackHMR;}const appEntrypoint=await pageLoader.routeLoader.whenEntrypoint('/_app');if('error'in appEntrypoint){throw appEntrypoint.error;}const{component:app,exports:mod}=appEntrypoint;CachedApp=app;if(mod&&mod.reportWebVitals){onPerfEntry=({id,name,startTime,value,duration,entryType,entries})=>{// Combines timestamp with random number for unique ID
const uniqueID=`${Date.now()}-${Math.floor(Math.random()*(9e12-1))+1e12}`;let perfStartEntry;if(entries&&entries.length){perfStartEntry=entries[0].startTime;}mod.reportWebVitals({id:id||uniqueID,name,startTime:startTime||perfStartEntry,value:value==null?duration:value,label:entryType==='mark'||entryType==='measure'?'custom':'web-vital'});};}let initialErr=hydrateErr;try{const pageEntrypoint=// The dev server fails to serve script assets when there's a hydration
// error, so we need to skip waiting for the entrypoint.
process.env.NODE_ENV==='development'&&hydrateErr?{error:hydrateErr}:await pageLoader.routeLoader.whenEntrypoint(page);if('error'in pageEntrypoint){throw pageEntrypoint.error;}CachedComponent=pageEntrypoint.component;if(process.env.NODE_ENV!=='production'){const{isValidElementType}=require('react-is');if(!isValidElementType(CachedComponent)){throw new Error(`The default export is not a React Component in page: "${page}"`);}}}catch(error){// This catches errors like throwing in the top level of a module
initialErr=error;}if(process.env.NODE_ENV==='development'){const{getNodeError}=require('@next/react-dev-overlay/lib/client');// Server-side runtime errors need to be re-thrown on the client-side so
// that the overlay is rendered.
if(initialErr){if(initialErr===hydrateErr){setTimeout(()=>{let error;try{// Generate a new error object. We `throw` it because some browsers
// will set the `stack` when thrown, and we want to ensure ours is
// not overridden when we re-throw it below.
throw new Error(initialErr.message);}catch(e){error=e;}error.name=initialErr.name;error.stack=initialErr.stack;const node=getNodeError(error);throw node;});}// We replaced the server-side error with a client-side error, and should
// no longer rewrite the stack trace to a Node error.
else{setTimeout(()=>{throw initialErr;});}}}if(window.__NEXT_PRELOADREADY){await window.__NEXT_PRELOADREADY(dynamicIds);}exports.router=router=(0,_router2.createRouter)(page,query,asPath,{initialProps:hydrateProps,pageLoader,App:CachedApp,Component:CachedComponent,wrapApp,err:initialErr,isFallback:Boolean(isFallback),subscription:(info,App,scroll)=>render(Object.assign({},info,{App,scroll})),locale,locales,defaultLocale,domainLocales,isPreview});// call init-client middleware
if(process.env.__NEXT_PLUGINS){// @ts-ignore
// eslint-disable-next-line
Promise.resolve().then(()=>(0,_interopRequireWildcard2.default)(require('next-plugin-loader?middleware=on-init-client!'))).then(initClientModule=>{return initClientModule.default({router});}).catch(initClientErr=>{console.error('Error calling client-init for plugins',initClientErr);});}const renderCtx={App:CachedApp,initial:true,Component:CachedComponent,props:hydrateProps,err:initialErr};if(process.env.NODE_ENV==='production'){render(renderCtx);return emitter;}else{return{emitter,render,renderCtx};}};exports.default=_default;async function render(renderingProps){if(renderingProps.err){await renderError(renderingProps);return;}try{await doRender(renderingProps);}catch(renderErr){// bubble up cancelation errors
if(renderErr.cancelled){throw renderErr;}if(process.env.NODE_ENV==='development'){// Ensure this error is displayed in the overlay in development
setTimeout(()=>{throw renderErr;});}await renderError((0,_extends2.default)({},renderingProps,{err:renderErr}));}}// This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.
function renderError(renderErrorProps){const{App,err}=renderErrorProps;// In development runtime errors are caught by our overlay
// In production we catch runtime errors using componentDidCatch which will trigger renderError
if(process.env.NODE_ENV!=='production'){// A Next.js rendering runtime error is always unrecoverable
// FIXME: let's make this recoverable (error in GIP client-transition)
webpackHMR.onUnrecoverableError();// We need to render an empty <App> so that the `<ReactDevOverlay>` can
// render itself.
return doRender({App:()=>null,props:{},Component:()=>null,styleSheets:[]});}if(process.env.__NEXT_PLUGINS){// @ts-ignore
// eslint-disable-next-line
Promise.resolve().then(()=>(0,_interopRequireWildcard2.default)(require('next-plugin-loader?middleware=on-error-client!'))).then(onClientErrorModule=>{return onClientErrorModule.default({err});}).catch(onClientErrorErr=>{console.error('error calling on-error-client for plugins',onClientErrorErr);});}// Make sure we log the error to the console, otherwise users can't track down issues.
console.error(err);return pageLoader.loadPage('/_error').then(({page:ErrorComponent,styleSheets})=>{// In production we do a normal render with the `ErrorComponent` as component.
// If we've gotten here upon initial render, we can use the props from the server.
// Otherwise, we need to call `getInitialProps` on `App` before mounting.
const AppTree=wrapApp(App);const appCtx={Component:ErrorComponent,AppTree,router,ctx:{err,pathname:page,query,asPath,AppTree}};return Promise.resolve(renderErrorProps.props?renderErrorProps.props:(0,_utils.loadGetInitialProps)(App,appCtx)).then(initProps=>doRender((0,_extends2.default)({},renderErrorProps,{err,Component:ErrorComponent,styleSheets,props:initProps})));});}let reactRoot=null;let shouldUseHydrate=typeof _reactDom.default.hydrate==='function';function renderReactElement(reactEl,domEl){if(process.env.__NEXT_REACT_MODE!=='legacy'){if(!reactRoot){const opts={hydrate:true};reactRoot=process.env.__NEXT_REACT_MODE==='concurrent'?_reactDom.default.unstable_createRoot(domEl,opts):_reactDom.default.unstable_createBlockingRoot(domEl,opts);}reactRoot.render(reactEl);}else{// mark start of hydrate/render
if(_utils.ST){performance.mark('beforeRender');}// The check for `.hydrate` is there to support React alternatives like preact
if(shouldUseHydrate){_reactDom.default.hydrate(reactEl,domEl,markHydrateComplete);shouldUseHydrate=false;}else{_reactDom.default.render(reactEl,domEl,markRenderComplete);}}}function markHydrateComplete(){if(!_utils.ST)return;performance.mark('afterHydrate');// mark end of hydration
performance.measure('Next.js-before-hydration','navigationStart','beforeRender');performance.measure('Next.js-hydration','beforeRender','afterHydrate');if(onPerfEntry){performance.getEntriesByName('Next.js-hydration').forEach(onPerfEntry);}clearMarks();}function markRenderComplete(){if(!_utils.ST)return;performance.mark('afterRender');// mark end of render
const navStartEntries=performance.getEntriesByName('routeChange','mark');if(!navStartEntries.length)return;performance.measure('Next.js-route-change-to-render',navStartEntries[0].name,'beforeRender');performance.measure('Next.js-render','beforeRender','afterRender');if(onPerfEntry){performance.getEntriesByName('Next.js-render').forEach(onPerfEntry);performance.getEntriesByName('Next.js-route-change-to-render').forEach(onPerfEntry);}clearMarks();['Next.js-route-change-to-render','Next.js-render'].forEach(measure=>performance.clearMeasures(measure));}function clearMarks(){;['beforeRender','afterHydrate','afterRender','routeChange'].forEach(mark=>performance.clearMarks(mark));}function AppContainer({children}){return/*#__PURE__*/_react.default.createElement(Container,{fn:error=>renderError({App:CachedApp,err:error}).catch(err=>console.error('Error rendering page: ',err))},/*#__PURE__*/_react.default.createElement(_routerContext.RouterContext.Provider,{value:(0,_router2.makePublicRouterInstance)(router)},/*#__PURE__*/_react.default.createElement(_headManagerContext.HeadManagerContext.Provider,{value:headManager},children)));}const wrapApp=App=>wrappedAppProps=>{const appProps=(0,_extends2.default)({},wrappedAppProps,{Component:CachedComponent,err:hydrateErr,router});return/*#__PURE__*/_react.default.createElement(AppContainer,null,/*#__PURE__*/_react.default.createElement(App,appProps));};let lastAppProps;function doRender(input){let{App,Component,props,err}=input;let styleSheets='initial'in input?undefined:input.styleSheets;Component=Component||lastAppProps.Component;props=props||lastAppProps.props;const appProps=(0,_extends2.default)({},props,{Component,err,router});// lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
lastAppProps=appProps;let canceled=false;let resolvePromise;const renderPromise=new Promise((resolve,reject)=>{if(lastRenderReject){lastRenderReject();}resolvePromise=()=>{lastRenderReject=null;resolve();};lastRenderReject=()=>{canceled=true;lastRenderReject=null;const error=new Error('Cancel rendering route');error.cancelled=true;reject(error);};});// This function has a return type to ensure it doesn't start returning a
// Promise. It should remain synchronous.
function onStart(){if(!styleSheets||// We use `style-loader` in development, so we don't need to do anything
// unless we're in production:
process.env.NODE_ENV!=='production'){return false;}const currentStyleTags=looseToArray(document.querySelectorAll('style[data-n-href]'));const currentHrefs=new Set(currentStyleTags.map(tag=>tag.getAttribute('data-n-href')));const noscript=document.querySelector('noscript[data-n-css]');const nonce=noscript==null?void 0:noscript.getAttribute('data-n-css');styleSheets.forEach(({href,text})=>{if(!currentHrefs.has(href)){const styleTag=document.createElement('style');styleTag.setAttribute('data-n-href',href);styleTag.setAttribute('media','x');if(nonce){styleTag.setAttribute('nonce',nonce);}document.head.appendChild(styleTag);styleTag.appendChild(document.createTextNode(text));}});return true;}function onHeadCommit(){if(// We use `style-loader` in development, so we don't need to do anything
// unless we're in production:
process.env.NODE_ENV==='production'&&// We can skip this during hydration. Running it wont cause any harm, but
// we may as well save the CPU cycles:
styleSheets&&// Ensure this render was not canceled
!canceled){const desiredHrefs=new Set(styleSheets.map(s=>s.href));const currentStyleTags=looseToArray(document.querySelectorAll('style[data-n-href]'));const currentHrefs=currentStyleTags.map(tag=>tag.getAttribute('data-n-href'));// Toggle `<style>` tags on or off depending on if they're needed:
for(let idx=0;idx<currentHrefs.length;++idx){if(desiredHrefs.has(currentHrefs[idx])){currentStyleTags[idx].removeAttribute('media');}else{currentStyleTags[idx].setAttribute('media','x');}}// Reorder styles into intended order:
let referenceNode=document.querySelector('noscript[data-n-css]');if(// This should be an invariant:
referenceNode){styleSheets.forEach(({href})=>{const targetTag=document.querySelector(`style[data-n-href="${href}"]`);if(// This should be an invariant:
targetTag){referenceNode.parentNode.insertBefore(targetTag,referenceNode.nextSibling);referenceNode=targetTag;}});}// Finally, clean up server rendered stylesheets:
looseToArray(document.querySelectorAll('link[data-n-p]')).forEach(el=>{el.parentNode.removeChild(el);});// Force browser to recompute layout, which should prevent a flash of
// unstyled content:
getComputedStyle(document.body,'height');}if(input.scroll){window.scrollTo(input.scroll.x,input.scroll.y);}}function onRootCommit(){resolvePromise();}const elem=/*#__PURE__*/_react.default.createElement(Root,{callback:onRootCommit},/*#__PURE__*/_react.default.createElement(Head,{callback:onHeadCommit}),/*#__PURE__*/_react.default.createElement(AppContainer,null,/*#__PURE__*/_react.default.createElement(App,appProps),/*#__PURE__*/_react.default.createElement(_portal.Portal,{type:"next-route-announcer"},/*#__PURE__*/_react.default.createElement(_routeAnnouncer.RouteAnnouncer,null))));onStart();// We catch runtime errors using componentDidCatch which will trigger renderError
renderReactElement(process.env.__NEXT_STRICT_MODE?/*#__PURE__*/_react.default.createElement(_react.default.StrictMode,null,elem):elem,appElement);return renderPromise;}function Root({callback,children}){// We use `useLayoutEffect` to guarantee the callback is executed
// as soon as React flushes the update.
_react.default.useLayoutEffect(()=>callback(),[callback]);if(process.env.__NEXT_TEST_MODE){// eslint-disable-next-line react-hooks/rules-of-hooks
_react.default.useEffect(()=>{window.__NEXT_HYDRATED=true;if(window.__NEXT_HYDRATED_CB){window.__NEXT_HYDRATED_CB();}},[]);}// We should ask to measure the Web Vitals after rendering completes so we
// don't cause any hydration delay:
_react.default.useEffect(()=>{(0,_performanceRelayer.default)(onPerfEntry);},[]);return children;}// Dummy component that we render as a child of Root so that we can
// toggle the correct styles before the page is rendered.
function Head({callback}){// We use `useLayoutEffect` to guarantee the callback is executed
// as soon as React flushes the update.
_react.default.useLayoutEffect(()=>callback(),[callback]);return null;}
//# sourceMappingURL=index.js.map