import type { AppType, DocumentType, NextComponentType } from '../shared/lib/utils';
import { BuildManifest } from './get-page-files';
import { PageConfig, GetStaticPaths, GetServerSideProps, GetStaticProps } from 'next/types';
export declare type ManifestItem = {
    id: number | string;
    files: string[];
};
export declare type ReactLoadableManifest = {
    [moduleId: string]: ManifestItem;
};
export declare type LoadComponentsReturnType = {
    Component: NextComponentType;
    pageConfig: PageConfig;
    buildManifest: BuildManifest;
    reactLoadableManifest: ReactLoadableManifest;
    Document: DocumentType;
    App: AppType;
    getStaticProps?: GetStaticProps;
    getStaticPaths?: GetStaticPaths;
    getServerSideProps?: GetServerSideProps;
    ComponentMod: any;
};
export declare function loadDefaultErrorComponents(distDir: string, { hasConcurrentFeatures }: {
    hasConcurrentFeatures: boolean;
}): Promise<{
    App: any;
    Document: any;
    Component: any;
    pageConfig: {};
    buildManifest: any;
    reactLoadableManifest: {};
    ComponentMod: any;
}>;
export declare function loadComponents(distDir: string, pathname: string, serverless: boolean): Promise<LoadComponentsReturnType>;
