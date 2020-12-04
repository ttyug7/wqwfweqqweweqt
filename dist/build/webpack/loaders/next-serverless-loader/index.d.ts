import { loader } from 'webpack';
export declare type ServerlessLoaderQuery = {
    page: string;
    distDir: string;
    absolutePagePath: string;
    absoluteAppPath: string;
    absoluteDocumentPath: string;
    absoluteErrorPath: string;
    absolute404Path: string;
    buildId: string;
    assetPrefix: string;
    generateEtags: string;
    poweredByHeader: string;
    canonicalBase: string;
    basePath: string;
    runtimeConfig: string;
    previewProps: string;
    loadedEnvFiles: string;
    i18n: string;
};
declare const nextServerlessLoader: loader.Loader;
export default nextServerlessLoader;