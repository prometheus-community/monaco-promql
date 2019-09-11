export declare const def: {
    id: string;
    extensions: string[];
    aliases: string[];
    mimetypes: any[];
    loader: () => Promise<typeof import("./promql")>;
};
