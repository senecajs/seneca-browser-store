declare function BrowserStore(this: any, options: any): {
    name: string;
    tag: any;
    exports: {
        makeApiMsg: (msg: any, ctx: any, options: any) => any;
    };
};
declare namespace BrowserStore {
    var defaults: {
        apimsg: {
            req: string;
            on: string;
            debounce$: boolean;
            q: (msg: any, ctx: any) => any;
            ent: (msg: any, ctx: any) => any;
            cmd: (msg: any, ctx: any) => any;
            canon: (msg: any, ctx: any) => any;
            store: (msg: any, ctx: any) => any;
        };
        prepareCtx: (msg: any, ctx: any) => any;
        handleResponse: {
            any: (seneca: any, ctx: any, reply: any, err: Error, out: any) => void;
            list: (seneca: any, ctx: any, reply: any, err: Error, out: any) => void;
        };
    };
}
export default BrowserStore;
