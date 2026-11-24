declare function BrowserStore(this: any, options: any): {
    name: string;
    tag: any;
    exports: {
        makeApiMsg: (msg: any, ctx: any, options: any) => any;
        msglog: {
            msg: any;
            meta: any;
            start: number;
            ctx?: any;
            apimsg?: any;
            res?: any;
            err?: any;
            apimeta?: any;
            apiend?: number;
            end?: number;
        }[];
    };
};

declare namespace BrowserStore {
    var defaults: ({ valid }: {
        valid: any;
    }) => {
        debug: boolean;
        map: any;
        apimsg: any;
        prepareCtx: (msg: any, ctx: any) => any;
        handleResponse: any;
    };
}
export default BrowserStore;

export { }


declare namespace BrowserStore {
    var defaults: ({ valid }: {
        valid: any;
    }) => {
        debug: boolean;
        map: any;
        apimsg: any;
        prepareCtx: (msg: any, ctx: any) => any;
        handleResponse: any;
    };
}

