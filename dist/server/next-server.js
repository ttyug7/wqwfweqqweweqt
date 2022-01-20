"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
};
exports.default = void 0;
var _utils = require("../shared/lib/utils");
var _requestMeta = require("./request-meta");
var _fs = _interopRequireDefault(require("fs"));
var _path = require("path");
var _http = require("http");
var _constants = require("../shared/lib/constants");
var _recursiveReaddirSync = require("./lib/recursive-readdir-sync");
var _url = require("url");
var _compression = _interopRequireDefault(require("next/dist/compiled/compression"));
var _httpProxy = _interopRequireDefault(require("next/dist/compiled/http-proxy"));
var _router = require("./router");
var _sandbox = require("./web/sandbox");
var _baseHttp = require("./base-http");
var _sendPayload = require("./send-payload");
var _serveStatic = require("./serve-static");
var _apiUtils = require("./api-utils");
var _render = require("./render");
var Log = _interopRequireWildcard(require("../build/output/log"));
var _baseServer = _interopRequireWildcard(require("./base-server"));
var _require = require("./require");
var _normalizePagePath = require("./normalize-page-path");
var _loadComponents = require("./load-components");
var _isError = _interopRequireWildcard(require("../lib/is-error"));
var _utils1 = require("./web/utils");
var _relativizeUrl = require("../shared/lib/router/utils/relativize-url");
var _parseNextUrl = require("../shared/lib/router/utils/parse-next-url");
var _prepareDestination = require("../shared/lib/router/utils/prepare-destination");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var _utils2 = require("../shared/lib/router/utils");
var _constants1 = require("../lib/constants");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
class NextNodeServer extends _baseServer.default {
    getHasStaticDir() {
        return _fs.default.existsSync((0, _path).join(this.dir, 'static'));
    }
    getPagesManifest() {
        const pagesManifestPath = (0, _path).join(this.serverBuildDir, _constants.PAGES_MANIFEST);
        return require(pagesManifestPath);
    }
    getBuildId() {
        const buildIdFile = (0, _path).join(this.distDir, _constants.BUILD_ID_FILE);
        try {
            return _fs.default.readFileSync(buildIdFile, 'utf8').trim();
        } catch (err) {
            if (!_fs.default.existsSync(buildIdFile)) {
                throw new Error(`Could not find a production build in the '${this.distDir}' directory. Try building your app with 'next build' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id`);
            }
            throw err;
        }
    }
    generateImageRoutes() {
        return [
            {
                match: (0, _router).route('/_next/image'),
                type: 'route',
                name: '_next/image catchall',
                fn: (req, res, _params, parsedUrl)=>{
                    if (this.minimalMode) {
                        res.statusCode = 400;
                        res.body('Bad Request').send();
                        return {
                            finished: true
                        };
                    }
                    return this.imageOptimizer(req, res, parsedUrl);
                }
            }, 
        ];
    }
    generateStaticRotes() {
        return this.hasStaticDir ? [
            {
                // It's very important to keep this route's param optional.
                // (but it should support as many params as needed, separated by '/')
                // Otherwise this will lead to a pretty simple DOS attack.
                // See more: https://github.com/vercel/next.js/issues/2617
                match: (0, _router).route('/static/:path*'),
                name: 'static catchall',
                fn: async (req, res, params, parsedUrl)=>{
                    const p = (0, _path).join(this.dir, 'static', ...params.path);
                    await this.serveStatic(req, res, p, parsedUrl);
                    return {
                        finished: true
                    };
                }
            }, 
        ] : [];
    }
    generateFsStaticRoutes() {
        return [
            {
                match: (0, _router).route('/_next/static/:path*'),
                type: 'route',
                name: '_next/static catchall',
                fn: async (req, res, params, parsedUrl)=>{
                    // make sure to 404 for /_next/static itself
                    if (!params.path) {
                        await this.render404(req, res, parsedUrl);
                        return {
                            finished: true
                        };
                    }
                    if (params.path[0] === _constants.CLIENT_STATIC_FILES_RUNTIME || params.path[0] === 'chunks' || params.path[0] === 'css' || params.path[0] === 'image' || params.path[0] === 'media' || params.path[0] === this.buildId || params.path[0] === 'pages' || params.path[1] === 'pages') {
                        this.setImmutableAssetCacheControl(res);
                    }
                    const p = (0, _path).join(this.distDir, _constants.CLIENT_STATIC_FILES_PATH, ...params.path || []);
                    await this.serveStatic(req, res, p, parsedUrl);
                    return {
                        finished: true
                    };
                }
            }, 
        ];
    }
    generatePublicRoutes() {
        if (!_fs.default.existsSync(this.publicDir)) return [];
        const publicFiles = new Set((0, _recursiveReaddirSync).recursiveReadDirSync(this.publicDir).map((p)=>encodeURI(p.replace(/\\/g, '/'))
        ));
        return [
            {
                match: (0, _router).route('/:path*'),
                name: 'public folder catchall',
                fn: async (req, res, params, parsedUrl)=>{
                    const pathParts = params.path || [];
                    const { basePath  } = this.nextConfig;
                    // if basePath is defined require it be present
                    if (basePath) {
                        const basePathParts = basePath.split('/');
                        // remove first empty value
                        basePathParts.shift();
                        if (!basePathParts.every((part, idx)=>{
                            return part === pathParts[idx];
                        })) {
                            return {
                                finished: false
                            };
                        }
                        pathParts.splice(0, basePathParts.length);
                    }
                    let path = `/${pathParts.join('/')}`;
                    if (!publicFiles.has(path)) {
                        // In `next-dev-server.ts`, we ensure encoded paths match
                        // decoded paths on the filesystem. So we need do the
                        // opposite here: make sure decoded paths match encoded.
                        path = encodeURI(path);
                    }
                    if (publicFiles.has(path)) {
                        await this.serveStatic(req, res, (0, _path).join(this.publicDir, ...pathParts), parsedUrl);
                        return {
                            finished: true
                        };
                    }
                    return {
                        finished: false
                    };
                }
            }, 
        ];
    }
    getFilesystemPaths() {
        if (this._validFilesystemPathSet) {
            return this._validFilesystemPathSet;
        }
        const pathUserFilesStatic = (0, _path).join(this.dir, 'static');
        let userFilesStatic = [];
        if (this.hasStaticDir && _fs.default.existsSync(pathUserFilesStatic)) {
            userFilesStatic = (0, _recursiveReaddirSync).recursiveReadDirSync(pathUserFilesStatic).map((f)=>(0, _path).join('.', 'static', f)
            );
        }
        let userFilesPublic = [];
        if (this.publicDir && _fs.default.existsSync(this.publicDir)) {
            userFilesPublic = (0, _recursiveReaddirSync).recursiveReadDirSync(this.publicDir).map((f)=>(0, _path).join('.', 'public', f)
            );
        }
        let nextFilesStatic = [];
        nextFilesStatic = !this.minimalMode && _fs.default.existsSync((0, _path).join(this.distDir, 'static')) ? (0, _recursiveReaddirSync).recursiveReadDirSync((0, _path).join(this.distDir, 'static')).map((f)=>(0, _path).join('.', (0, _path).relative(this.dir, this.distDir), 'static', f)
        ) : [];
        return this._validFilesystemPathSet = new Set([
            ...nextFilesStatic,
            ...userFilesPublic,
            ...userFilesStatic, 
        ]);
    }
    sendRenderResult(req, res, options) {
        return (0, _sendPayload).sendRenderResult({
            req: req.originalRequest,
            res: res.originalResponse,
            ...options
        });
    }
    sendStatic(req, res, path) {
        return (0, _serveStatic).serveStatic(req.originalRequest, res.originalResponse, path);
    }
    handleCompression(req, res) {
        if (this.compression) {
            this.compression(req.originalRequest, res.originalResponse, ()=>{
            });
        }
    }
    async proxyRequest(req, res, parsedUrl) {
        const { query  } = parsedUrl;
        delete parsedUrl.query;
        parsedUrl.search = (0, _baseServer).stringifyQuery(req, query);
        const target = (0, _url).format(parsedUrl);
        const proxy = new _httpProxy.default({
            target,
            changeOrigin: true,
            ignorePath: true,
            xfwd: true,
            proxyTimeout: 30000
        });
        await new Promise((proxyResolve, proxyReject)=>{
            let finished = false;
            proxy.on('proxyReq', (proxyReq)=>{
                proxyReq.on('close', ()=>{
                    if (!finished) {
                        finished = true;
                        proxyResolve(true);
                    }
                });
            });
            proxy.on('error', (err)=>{
                if (!finished) {
                    finished = true;
                    proxyReject(err);
                }
            });
            proxy.web(req.originalRequest, res.originalResponse);
        });
        return {
            finished: true
        };
    }
    async runApi(req, res, query, params, page, builtPagePath) {
        const pageModule = await require(builtPagePath);
        query = {
            ...query,
            ...params
        };
        delete query.__nextLocale;
        delete query.__nextDefaultLocale;
        if (!this.renderOpts.dev && this._isLikeServerless) {
            if (typeof pageModule.default === 'function') {
                (0, _baseServer).prepareServerlessUrl(req, query);
                await pageModule.default(req, res);
                return true;
            }
        }
        await (0, _apiUtils).apiResolver(req.originalRequest, res.originalResponse, query, pageModule, this.renderOpts.previewProps, this.minimalMode, this.renderOpts.dev, page);
        return true;
    }
    async renderHTML(req, res, pathname, query, renderOpts) {
        return (0, _render).renderToHTML(req.originalRequest, res.originalResponse, pathname, query, renderOpts);
    }
    streamResponseChunk(res, chunk) {
        res.originalResponse.write(chunk);
    }
    async imageOptimizer(req, res, parsedUrl) {
        const { imageOptimizer  } = require('./image-optimizer');
        return imageOptimizer(req.originalRequest, res.originalResponse, parsedUrl, this.nextConfig, this.distDir, ()=>this.render404(req, res, parsedUrl)
        , (newReq, newRes, newParsedUrl)=>this.getRequestHandler()(new _baseHttp.NodeNextRequest(newReq), new _baseHttp.NodeNextResponse(newRes), newParsedUrl)
        , this.renderOpts.dev);
    }
    getPagePath(pathname, locales) {
        return (0, _require).getPagePath(pathname, this.distDir, this._isLikeServerless, this.renderOpts.dev, locales);
    }
    async findPageComponents(pathname, query = {
    }, params = null) {
        let paths = [
            // try serving a static AMP version first
            query.amp ? (0, _normalizePagePath).normalizePagePath(pathname) + '.amp' : null,
            pathname, 
        ].filter(Boolean);
        if (query.__nextLocale) {
            paths = [
                ...paths.map((path)=>`/${query.__nextLocale}${path === '/' ? '' : path}`
                ),
                ...paths, 
            ];
        }
        for (const pagePath of paths){
            try {
                const components = await (0, _loadComponents).loadComponents(this.distDir, pagePath, !this.renderOpts.dev && this._isLikeServerless);
                if (query.__nextLocale && typeof components.Component === 'string' && !(pagePath === null || pagePath === void 0 ? void 0 : pagePath.startsWith(`/${query.__nextLocale}`))) {
                    continue;
                }
                return {
                    components,
                    query: {
                        ...components.getStaticProps ? {
                            amp: query.amp,
                            _nextDataReq: query._nextDataReq,
                            __nextLocale: query.__nextLocale,
                            __nextDefaultLocale: query.__nextDefaultLocale
                        } : query,
                        ...params || {
                        }
                    }
                };
            } catch (err) {
                if ((0, _isError).default(err) && err.code !== 'ENOENT') throw err;
            }
        }
        return null;
    }
    getFontManifest() {
        return (0, _require).requireFontManifest(this.distDir, this._isLikeServerless);
    }
    getCacheFilesystem() {
        return {
            readFile: (f)=>_fs.default.promises.readFile(f, 'utf8')
            ,
            readFileSync: (f)=>_fs.default.readFileSync(f, 'utf8')
            ,
            writeFile: (f, d)=>_fs.default.promises.writeFile(f, d, 'utf8')
            ,
            mkdir: (dir)=>_fs.default.promises.mkdir(dir, {
                    recursive: true
                })
            ,
            stat: (f)=>_fs.default.promises.stat(f)
        };
    }
    normalizeReq(req) {
        return req instanceof _http.IncomingMessage ? new _baseHttp.NodeNextRequest(req) : req;
    }
    normalizeRes(res) {
        return res instanceof _http.ServerResponse ? new _baseHttp.NodeNextResponse(res) : res;
    }
    getRequestHandler() {
        const handler = super.getRequestHandler();
        return async (req, res, parsedUrl)=>{
            return handler(this.normalizeReq(req), this.normalizeRes(res), parsedUrl);
        };
    }
    async render(req, res, pathname, query, parsedUrl) {
        return super.render(this.normalizeReq(req), this.normalizeRes(res), pathname, query, parsedUrl);
    }
    async renderToHTML(req, res, pathname, query) {
        return super.renderToHTML(this.normalizeReq(req), this.normalizeRes(res), pathname, query);
    }
    async renderError(err, req, res, pathname, query, setHeaders) {
        return super.renderError(err, this.normalizeReq(req), this.normalizeRes(res), pathname, query, setHeaders);
    }
    async renderErrorToHTML(err, req, res, pathname, query) {
        return super.renderErrorToHTML(err, this.normalizeReq(req), this.normalizeRes(res), pathname, query);
    }
    async render404(req, res, parsedUrl, setHeaders) {
        return super.render404(this.normalizeReq(req), this.normalizeRes(res), parsedUrl, setHeaders);
    }
    async serveStatic(req, res, path, parsedUrl) {
        if (!this.isServeableUrl(path)) {
            return this.render404(req, res, parsedUrl);
        }
        if (!(req.method === 'GET' || req.method === 'HEAD')) {
            res.statusCode = 405;
            res.setHeader('Allow', [
                'GET',
                'HEAD'
            ]);
            return this.renderError(null, req, res, path);
        }
        try {
            await this.sendStatic(req, res, path);
        } catch (error) {
            if (!(0, _isError).default(error)) throw error;
            const err = error;
            if (err.code === 'ENOENT' || err.statusCode === 404) {
                this.render404(req, res, parsedUrl);
            } else if (err.statusCode === 412) {
                res.statusCode = 412;
                return this.renderError(err, req, res, path);
            } else {
                throw err;
            }
        }
    }
    getStaticRoutes() {
        return this.hasStaticDir ? [
            {
                // It's very important to keep this route's param optional.
                // (but it should support as many params as needed, separated by '/')
                // Otherwise this will lead to a pretty simple DOS attack.
                // See more: https://github.com/vercel/next.js/issues/2617
                match: (0, _router).route('/static/:path*'),
                name: 'static catchall',
                fn: async (req, res, params, parsedUrl)=>{
                    const p = (0, _path).join(this.dir, 'static', ...params.path);
                    await this.serveStatic(req, res, p, parsedUrl);
                    return {
                        finished: true
                    };
                }
            }, 
        ] : [];
    }
    isServeableUrl(untrustedFileUrl) {
        // This method mimics what the version of `send` we use does:
        // 1. decodeURIComponent:
        //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L989
        //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L518-L522
        // 2. resolve:
        //    https://github.com/pillarjs/send/blob/de073ed3237ade9ff71c61673a34474b30e5d45b/index.js#L561
        let decodedUntrustedFilePath;
        try {
            // (1) Decode the URL so we have the proper file name
            decodedUntrustedFilePath = decodeURIComponent(untrustedFileUrl);
        } catch  {
            return false;
        }
        // (2) Resolve "up paths" to determine real request
        const untrustedFilePath = (0, _path).resolve(decodedUntrustedFilePath);
        // don't allow null bytes anywhere in the file path
        if (untrustedFilePath.indexOf('\x00') !== -1) {
            return false;
        }
        // Check if .next/static, static and public are in the path.
        // If not the path is not available.
        if ((untrustedFilePath.startsWith((0, _path).join(this.distDir, 'static') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.dir, 'static') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.dir, 'public') + _path.sep)) === false) {
            return false;
        }
        // Check against the real filesystem paths
        const filesystemUrls = this.getFilesystemPaths();
        const resolved = (0, _path).relative(this.dir, untrustedFilePath);
        return filesystemUrls.has(resolved);
    }
    getMiddlewareInfo(params) {
        return (0, _require).getMiddlewareInfo(params);
    }
    getMiddlewareManifest() {
        if (!this.minimalMode) {
            const middlewareManifestPath = (0, _path).join((0, _path).join(this.distDir, _constants.SERVER_DIRECTORY), _constants.MIDDLEWARE_MANIFEST);
            return require(middlewareManifestPath);
        }
        return undefined;
    }
    generateCatchAllMiddlewareRoute() {
        if (this.minimalMode) return undefined;
        return {
            match: (0, _router).route('/:path*'),
            type: 'route',
            name: 'middleware catchall',
            fn: async (req, res, _params, parsed)=>{
                var ref, ref1;
                if (!((ref = this.middleware) === null || ref === void 0 ? void 0 : ref.length)) {
                    return {
                        finished: false
                    };
                }
                const initUrl = (0, _requestMeta).getRequestMeta(req, '__NEXT_INIT_URL');
                const parsedUrl = (0, _parseNextUrl).parseNextUrl({
                    url: initUrl,
                    headers: req.headers,
                    nextConfig: {
                        basePath: this.nextConfig.basePath,
                        i18n: this.nextConfig.i18n,
                        trailingSlash: this.nextConfig.trailingSlash
                    }
                });
                if (!((ref1 = this.middleware) === null || ref1 === void 0 ? void 0 : ref1.some((m)=>m.match(parsedUrl.pathname)
                ))) {
                    return {
                        finished: false
                    };
                }
                let result = null;
                try {
                    result = await this.runMiddleware({
                        request: req,
                        response: res,
                        parsedUrl: parsedUrl,
                        parsed: parsed
                    });
                } catch (err) {
                    if ((0, _isError).default(err) && err.code === 'ENOENT') {
                        await this.render404(req, res, parsed);
                        return {
                            finished: true
                        };
                    }
                    const error = (0, _isError).getProperError(err);
                    console.error(error);
                    res.statusCode = 500;
                    this.renderError(error, req, res, parsed.pathname || '');
                    return {
                        finished: true
                    };
                }
                if (result === null) {
                    return {
                        finished: true
                    };
                }
                if (result.response.headers.has('x-middleware-rewrite')) {
                    const value = result.response.headers.get('x-middleware-rewrite');
                    const rel = (0, _relativizeUrl).relativizeURL(value, initUrl);
                    result.response.headers.set('x-middleware-rewrite', rel);
                }
                if (result.response.headers.has('Location')) {
                    const value = result.response.headers.get('Location');
                    const rel = (0, _relativizeUrl).relativizeURL(value, initUrl);
                    result.response.headers.set('Location', rel);
                }
                if (!result.response.headers.has('x-middleware-rewrite') && !result.response.headers.has('x-middleware-next') && !result.response.headers.has('Location')) {
                    result.response.headers.set('x-middleware-refresh', '1');
                }
                result.response.headers.delete('x-middleware-next');
                for (const [key, value] of Object.entries((0, _utils1).toNodeHeaders(result.response.headers))){
                    if (key !== 'content-encoding' && value !== undefined) {
                        res.setHeader(key, value);
                    }
                }
                const preflight = req.method === 'HEAD' && req.headers['x-middleware-preflight'];
                if (preflight) {
                    res.statusCode = 200;
                    res.send();
                    return {
                        finished: true
                    };
                }
                res.statusCode = result.response.status;
                res.statusMessage = result.response.statusText;
                const location = result.response.headers.get('Location');
                if (location) {
                    res.statusCode = result.response.status;
                    if (res.statusCode === 308) {
                        res.setHeader('Refresh', `0;url=${location}`);
                    }
                    res.body(location).send();
                    return {
                        finished: true
                    };
                }
                if (result.response.headers.has('x-middleware-rewrite')) {
                    const { newUrl , parsedDestination  } = (0, _prepareDestination).prepareDestination({
                        appendParamsToQuery: true,
                        destination: result.response.headers.get('x-middleware-rewrite'),
                        params: _params,
                        query: parsedUrl.query
                    });
                    if (parsedDestination.protocol && (parsedDestination.port ? `${parsedDestination.hostname}:${parsedDestination.port}` : parsedDestination.hostname) !== req.headers.host) {
                        return this.proxyRequest(req, res, parsedDestination);
                    }
                    if (this.nextConfig.i18n) {
                        const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(newUrl, this.nextConfig.i18n.locales);
                        if (localePathResult.detectedLocale) {
                            parsedDestination.query.__nextLocale = localePathResult.detectedLocale;
                        }
                    }
                    (0, _requestMeta).addRequestMeta(req, '_nextRewroteUrl', newUrl);
                    (0, _requestMeta).addRequestMeta(req, '_nextDidRewrite', newUrl !== req.url);
                    return {
                        finished: false,
                        pathname: newUrl,
                        query: parsedDestination.query
                    };
                }
                if (result.response.headers.has('x-middleware-refresh')) {
                    res.statusCode = result.response.status;
                    for await (const chunk of result.response.body || []){
                        this.streamResponseChunk(res, chunk);
                    }
                    res.send();
                    return {
                        finished: true
                    };
                }
                return {
                    finished: false
                };
            }
        };
    }
    getMiddleware() {
        var ref, ref6;
        const middleware = ((ref = this.middlewareManifest) === null || ref === void 0 ? void 0 : ref.middleware) || {
        };
        return ((ref6 = this.middlewareManifest) === null || ref6 === void 0 ? void 0 : ref6.sortedMiddleware.map((page)=>({
                match: (0, _utils2).getRouteMatcher((0, _utils2).getMiddlewareRegex(page, _constants1.MIDDLEWARE_ROUTE.test(middleware[page].name))),
                page
            })
        )) || [];
    }
    async runMiddleware(params) {
        this.middlewareBetaWarning();
        // For middleware to "fetch" we must always provide an absolute URL
        const url = (0, _requestMeta).getRequestMeta(params.request, '__NEXT_INIT_URL');
        if (!url.startsWith('http')) {
            throw new Error('To use middleware you must provide a `hostname` and `port` to the Next.js Server');
        }
        const page = {
        };
        if (await this.hasPage(params.parsedUrl.pathname)) {
            page.name = params.parsedUrl.pathname;
        } else if (this.dynamicRoutes) {
            for (const dynamicRoute of this.dynamicRoutes){
                const matchParams = dynamicRoute.match(params.parsedUrl.pathname);
                if (matchParams) {
                    page.name = dynamicRoute.page;
                    page.params = matchParams;
                    break;
                }
            }
        }
        const allHeaders = new Headers();
        let result = null;
        for (const middleware of this.middleware || []){
            if (middleware.match(params.parsedUrl.pathname)) {
                if (!await this.hasMiddleware(middleware.page, middleware.ssr)) {
                    console.warn(`The Edge Function for ${middleware.page} was not found`);
                    continue;
                }
                await this.ensureMiddleware(middleware.page, middleware.ssr);
                const middlewareInfo = this.getMiddlewareInfo({
                    dev: this.renderOpts.dev,
                    distDir: this.distDir,
                    page: middleware.page,
                    serverless: this._isLikeServerless
                });
                result = await (0, _sandbox).run({
                    name: middlewareInfo.name,
                    paths: middlewareInfo.paths,
                    env: middlewareInfo.env,
                    request: {
                        headers: params.request.headers,
                        method: params.request.method || 'GET',
                        nextConfig: {
                            basePath: this.nextConfig.basePath,
                            i18n: this.nextConfig.i18n,
                            trailingSlash: this.nextConfig.trailingSlash
                        },
                        url: url,
                        page: page
                    },
                    useCache: !this.nextConfig.experimental.concurrentFeatures,
                    onWarning: (warning)=>{
                        if (params.onWarning) {
                            warning.message += ` "./${middlewareInfo.name}"`;
                            params.onWarning(warning);
                        }
                    }
                });
                for (let [key, value] of result.response.headers){
                    if (key !== 'x-middleware-next') {
                        allHeaders.append(key, value);
                    }
                }
                if (!this.renderOpts.dev) {
                    result.waitUntil.catch((error)=>{
                        console.error(`Uncaught: middleware waitUntil errored`, error);
                    });
                }
                if (!result.response.headers.has('x-middleware-next')) {
                    break;
                }
            }
        }
        if (!result) {
            this.render404(params.request, params.response, params.parsed);
        } else {
            for (let [key, value] of allHeaders){
                result.response.headers.set(key, value);
            }
        }
        return result;
    }
    constructor(...args){
        super(...args);
        this.compression = this.nextConfig.compress && this.nextConfig.target === 'server' ? (0, _compression).default() : undefined;
        this._validFilesystemPathSet = null;
        this.middlewareBetaWarning = (0, _utils).execOnce(()=>{
            Log.warn(`using beta Middleware (not covered by semver) - https://nextjs.org/docs/messages/beta-middleware`);
        });
    }
}
exports.default = NextNodeServer;
Object.keys(_baseServer).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _baseServer[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _baseServer[key];
        }
    });
});

//# sourceMappingURL=next-server.js.map