import { Header, Redirect, Rewrite } from '../lib/load-custom-routes';
import { ImageConfig } from './image-config';
declare type NoOptionals<T> = {
    [P in keyof T]-?: T[P];
};
export declare type NextConfigComplete = NoOptionals<NextConfig>;
export interface I18NConfig {
    defaultLocale: string;
    domains?: DomainLocale[];
    localeDetection?: false;
    locales: string[];
}
export interface DomainLocale {
    defaultLocale: string;
    domain: string;
    http?: true;
    locales?: string[];
}
export interface ESLintConfig {
    /** Only run ESLint on these directories with `next lint` and `next build`. */
    dirs?: string[];
    /** Do not run ESLint during production builds (`next build`). */
    ignoreDuringBuilds?: boolean;
}
export declare type NextConfig = {
    [key: string]: any;
} & {
    i18n?: I18NConfig | null;
    eslint?: ESLintConfig;
    headers?: () => Promise<Header[]>;
    rewrites?: () => Promise<Rewrite[] | {
        beforeFiles: Rewrite[];
        afterFiles: Rewrite[];
        fallback: Rewrite[];
    }>;
    redirects?: () => Promise<Redirect[]>;
    webpack5?: false;
    excludeDefaultMomentLocales?: boolean;
    trailingSlash?: boolean;
    env?: {
        [key: string]: string;
    };
    distDir?: string;
    cleanDistDir?: boolean;
    assetPrefix?: string;
    useFileSystemPublicRoutes?: boolean;
    generateBuildId?: () => string | null;
    generateEtags?: boolean;
    pageExtensions?: string[];
    compress?: boolean;
    images?: ImageConfig;
    devIndicators?: {
        buildActivity?: boolean;
    };
    onDemandEntries?: {
        maxInactiveAge?: number;
        pagesBufferLength?: number;
    };
    amp?: {
        canonicalBase?: string;
    };
    basePath?: string;
    sassOptions?: {
        [key: string]: any;
    };
    productionBrowserSourceMaps?: boolean;
    optimizeFonts?: boolean;
    reactStrictMode?: boolean;
    publicRuntimeConfig?: {
        [key: string]: any;
    };
    serverRuntimeConfig?: {
        [key: string]: any;
    };
    httpAgentOptions?: {
        keepAlive?: boolean;
    };
    future?: {
        /**
         * @deprecated this options was moved to the top level
         */
        webpack5?: false;
        strictPostcssConfiguration?: boolean;
    };
    experimental?: {
        cpus?: number;
        plugins?: boolean;
        profiling?: boolean;
        isrFlushToDisk?: boolean;
        reactMode?: 'legacy' | 'concurrent' | 'blocking';
        workerThreads?: boolean;
        pageEnv?: boolean;
        optimizeImages?: boolean;
        optimizeCss?: boolean;
        scrollRestoration?: boolean;
        stats?: boolean;
        externalDir?: boolean;
        conformance?: boolean;
        amp?: {
            optimizer?: any;
            validator?: string;
            skipValidation?: boolean;
        };
        reactRoot?: boolean;
        disableOptimizedLoading?: boolean;
        gzipSize?: boolean;
        craCompat?: boolean;
        esmExternals?: boolean | 'loose';
        staticPageGenerationTimeout?: number;
        pageDataCollectionTimeout?: number;
        isrMemoryCacheSize?: number;
    };
};
export declare const defaultConfig: NextConfig;
export declare function normalizeConfig(phase: string, config: any): any;
export {};