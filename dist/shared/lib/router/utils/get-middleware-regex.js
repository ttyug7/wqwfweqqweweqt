"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMiddlewareRegex = getMiddlewareRegex;
var _routeRegex = require("./route-regex");
// Identify ^/[param]/ in route string
const FIRST_SEGMENT_DYNAMIC = /^\/\[[^/]+?\](?=\/|$)/;
const NOT_API_ROUTE = '(?!/api(?:/|$))';
function getMiddlewareRegex(normalizedRoute, catchAll = true) {
    const result = (0, _routeRegex).getParametrizedRoute(normalizedRoute);
    const notApiRegex = FIRST_SEGMENT_DYNAMIC.test(normalizedRoute) ? NOT_API_ROUTE : '';
    let catchAllRegex = catchAll ? '(?!_next($|/)).*' : '';
    let catchAllGroupedRegex = catchAll ? '(?:(/.*)?)' : '';
    if ('routeKeys' in result) {
        if (result.parameterizedRoute === '/') {
            return {
                groups: {
                },
                namedRegex: `^/${catchAllRegex}$`,
                re: new RegExp(`^/${catchAllRegex}$`),
                routeKeys: {
                }
            };
        }
        return {
            groups: result.groups,
            namedRegex: `^${notApiRegex}${result.namedParameterizedRoute}${catchAllGroupedRegex}$`,
            re: new RegExp(`^${notApiRegex}${result.parameterizedRoute}${catchAllGroupedRegex}$`),
            routeKeys: result.routeKeys
        };
    }
    if (result.parameterizedRoute === '/') {
        return {
            groups: {
            },
            re: new RegExp(`^/${catchAllRegex}$`)
        };
    }
    return {
        groups: {
        },
        re: new RegExp(`^${notApiRegex}${result.parameterizedRoute}${catchAllGroupedRegex}$`)
    };
}

//# sourceMappingURL=get-middleware-regex.js.map