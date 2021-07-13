import { webpack } from 'next/dist/compiled/webpack/webpack';
import { NextConfig } from '../../../server/config';
export declare function build(config: webpack.Configuration, { rootDirectory, customAppFile, isDevelopment, isServer, assetPrefix, sassOptions, productionBrowserSourceMaps, future, isCraCompat, }: {
    rootDirectory: string;
    customAppFile: string | null;
    isDevelopment: boolean;
    isServer: boolean;
    assetPrefix: string;
    sassOptions: any;
    productionBrowserSourceMaps: boolean;
    future: NextConfig['future'];
    isCraCompat?: boolean;
}): Promise<webpack.Configuration>;
