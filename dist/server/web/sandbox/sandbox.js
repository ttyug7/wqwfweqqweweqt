"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clearSandboxCache = clearSandboxCache;
exports.run = run;
var _formdataNode = require("next/dist/compiled/formdata-node");
var _path = require("path");
var _webStreamsPolyfill = require("next/dist/compiled/web-streams-polyfill");
var _fs = require("fs");
var polyfills = _interopRequireWildcard(require("./polyfills"));
var _cookie = _interopRequireDefault(require("next/dist/compiled/cookie"));
var _vm = _interopRequireDefault(require("vm"));
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
let cache;
const WEBPACK_HASH_REGEX = /__webpack_require__\.h = function\(\) \{ return "[0-9a-f]+"; \}/g;
function clearSandboxCache(path, content) {
    var ref;
    const prev = (ref = cache === null || cache === void 0 ? void 0 : cache.paths.get(path)) === null || ref === void 0 ? void 0 : ref.replace(WEBPACK_HASH_REGEX, '');
    if (prev === undefined) return;
    if (prev === content.toString().replace(WEBPACK_HASH_REGEX, '')) return;
    cache = undefined;
}
async function run(params) {
    if (cache === undefined) {
        const context = {
            _ENTRIES: {
            },
            atob: polyfills.atob,
            Blob: _formdataNode.Blob,
            btoa: polyfills.btoa,
            clearInterval,
            clearTimeout,
            console: {
                assert: console.assert.bind(console),
                error: console.error.bind(console),
                info: console.info.bind(console),
                log: console.log.bind(console),
                time: console.time.bind(console),
                timeEnd: console.timeEnd.bind(console),
                timeLog: console.timeLog.bind(console),
                warn: console.warn.bind(console)
            },
            Crypto: polyfills.Crypto,
            crypto: new polyfills.Crypto(),
            fetch,
            File: _formdataNode.File,
            FormData: _formdataNode.FormData,
            process: {
                env: {
                    ...process.env
                }
            },
            ReadableStream: _webStreamsPolyfill.ReadableStream,
            setInterval,
            setTimeout,
            TextDecoder: polyfills.TextDecoder,
            TextEncoder: polyfills.TextEncoder,
            TransformStream: _webStreamsPolyfill.TransformStream,
            URL,
            URLSearchParams
        };
        context.self = context;
        cache = {
            context,
            require: new Map([
                [
                    require.resolve('next/dist/compiled/cookie'),
                    {
                        exports: _cookie.default
                    }
                ], 
            ]),
            paths: new Map(),
            sandbox: _vm.default.createContext(context)
        };
        loadDependencies(cache.sandbox, [
            {
                path: require.resolve('../spec-compliant/headers'),
                map: {
                    Headers: 'Headers'
                }
            },
            {
                path: require.resolve('../spec-compliant/response'),
                map: {
                    Response: 'Response'
                }
            },
            {
                path: require.resolve('../spec-compliant/request'),
                map: {
                    Request: 'Request'
                }
            }, 
        ]);
    }
    for (const paramPath of params.paths){
        if (!cache.paths.has(paramPath)) {
            const content = (0, _fs).readFileSync(paramPath, 'utf-8');
            try {
                _vm.default.runInNewContext(content, cache.sandbox, {
                    filename: paramPath
                });
                cache.paths.set(paramPath, content);
            } catch (error) {
                cache = undefined;
                throw error;
            }
        }
    }
    const entryPoint = cache.context._ENTRIES[`middleware_${params.name}`];
    return entryPoint.default({
        request: params.request
    });
}
function loadDependencies(ctx, dependencies) {
    for (const { path , map  } of dependencies){
        const mod = sandboxRequire(path, path);
        for (const mapKey of Object.keys(map)){
            ctx[map[mapKey]] = mod[mapKey];
        }
    }
}
function sandboxRequire(referrer, specifier) {
    const resolved = require.resolve(specifier, {
        paths: [
            (0, _path).dirname(referrer)
        ]
    });
    const cached = cache === null || cache === void 0 ? void 0 : cache.require.get(resolved);
    if (cached !== undefined) {
        return cached.exports;
    }
    const module = {
        exports: {
        },
        loaded: false,
        id: resolved
    };
    cache === null || cache === void 0 ? void 0 : cache.require.set(resolved, module);
    const fn = _vm.default.runInContext(`(function(module,exports,require,__dirname,__filename) {${(0, _fs).readFileSync(resolved, 'utf-8')}\n})`, cache.sandbox);
    try {
        fn(module, module.exports, sandboxRequire.bind(null, resolved), (0, _path).dirname(resolved), resolved);
    } finally{
        cache === null || cache === void 0 ? void 0 : cache.require.delete(resolved);
    }
    module.loaded = true;
    return module.exports;
}

//# sourceMappingURL=sandbox.js.map