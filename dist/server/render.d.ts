/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import type { __ApiPreviewProps } from './api-utils';
import type { FontManifest } from './font-utils';
import type { LoadComponentsReturnType } from './load-components';
import { DomainLocale } from './config';
import RenderResult from './render-result';
export declare type RenderOptsPartial = {
    buildId: string;
    canonicalBase: string;
    runtimeConfig?: {
        [key: string]: any;
    };
    assetPrefix?: string;
    err?: Error | null;
    nextExport?: boolean;
    dev?: boolean;
    ampPath?: string;
    ErrorDebug?: React.ComponentType<{
        error: Error;
    }>;
    ampValidator?: (html: string, pathname: string) => Promise<void>;
    ampSkipValidation?: boolean;
    ampOptimizerConfig?: {
        [key: string]: any;
    };
    isDataReq?: boolean;
    params?: ParsedUrlQuery;
    previewProps: __ApiPreviewProps;
    basePath: string;
    unstable_runtimeJS?: false;
    unstable_JsPreload?: false;
    optimizeFonts: boolean;
    fontManifest?: FontManifest;
    optimizeImages: boolean;
    optimizeCss: any;
    devOnlyCacheBusterQueryString?: string;
    resolvedUrl?: string;
    resolvedAsPath?: string;
    renderServerComponent?: null | (() => Promise<string>);
    distDir?: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
    domainLocales?: DomainLocale[];
    disableOptimizedLoading?: boolean;
    supportsDynamicHTML?: boolean;
    concurrentFeatures?: boolean;
    customServer?: boolean;
};
export declare type RenderOpts = LoadComponentsReturnType & RenderOptsPartial;
export declare function renderToHTML(req: IncomingMessage, res: ServerResponse, pathname: string, query: ParsedUrlQuery, renderOpts: RenderOpts): Promise<RenderResult | null>;
export declare function useMaybeDeferContent(_name: string, contentFn: () => JSX.Element): [boolean, JSX.Element];
