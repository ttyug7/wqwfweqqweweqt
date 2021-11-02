export declare type OutputState = {
    bootstrap: true;
    appUrl: string | null;
    bindAddr: string | null;
} | ({
    bootstrap: false;
    appUrl: string | null;
    bindAddr: string | null;
} & ({
    loading: true;
    trigger: string | undefined;
} | {
    loading: false;
    typeChecking: boolean;
    partial: 'client' | 'server' | 'serverWeb' | undefined;
    modules: number;
    errors: string[] | null;
    warnings: string[] | null;
    hasServerWeb: boolean;
}));
export declare const store: import("unistore").Store<OutputState>;
