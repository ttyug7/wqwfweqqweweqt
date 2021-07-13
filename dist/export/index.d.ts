import { NextConfigComplete } from '../server/config-shared';
interface ExportOptions {
    outdir: string;
    silent?: boolean;
    threads?: number;
    pages?: string[];
    buildExport?: boolean;
    statusMessage?: string;
}
export default function exportApp(dir: string, options: ExportOptions, configuration?: NextConfigComplete): Promise<void>;
export {};
