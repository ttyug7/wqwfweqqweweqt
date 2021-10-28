"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.base = void 0;
var _lodashCurry = _interopRequireDefault(require("next/dist/compiled/lodash.curry"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const base = (0, _lodashCurry).default(function base(ctx, config) {
    config.mode = ctx.isDevelopment ? 'development' : 'production';
    config.name = ctx.isServer ? ctx.webServerRuntime ? 'server-web' : 'server' : 'client';
    // @ts-ignore TODO webpack 5 typings
    config.target = !ctx.targetWeb ? 'node12.22' : [
        'web',
        'es5'
    ];
    // https://webpack.js.org/configuration/devtool/#development
    if (ctx.isDevelopment) {
        if (process.env.__NEXT_TEST_MODE && !process.env.__NEXT_TEST_WITH_DEVTOOL) {
            config.devtool = false;
        } else {
            if (!ctx.webServerRuntime) {
                // `eval-source-map` provides full-fidelity source maps for the
                // original source, including columns and original variable names.
                // This is desirable so the in-browser debugger can correctly pause
                // and show scoped variables with their original names.
                config.devtool = 'eval-source-map';
            }
        }
    } else {
        // Enable browser sourcemaps:
        if (ctx.productionBrowserSourceMaps && ctx.isClient) {
            config.devtool = 'source-map';
        } else {
            config.devtool = false;
        }
    }
    if (!config.module) {
        config.module = {
            rules: []
        };
    }
    // TODO: add codemod for "Should not import the named export" with JSON files
    // config.module.strictExportPresence = !isWebpack5
    return config;
});
exports.base = base;

//# sourceMappingURL=base.js.map