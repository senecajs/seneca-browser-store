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
    var defaults: {
        debug: boolean;
        apimsg: {
            aim: string;
            on: string;
            q: (msg: any, _ctx: any) => any;
            ent: (msg: any, _ctx: any) => any;
            save: (_msg: any, ctx: any) => "entity" | undefined;
            load: (_msg: any, ctx: any) => "entity" | undefined;
            list: (_msg: any, ctx: any) => "entity" | undefined;
            remove: (_msg: any, ctx: any) => "entity" | undefined;
            store: (_msg: any, ctx: any) => any;
            name: (_msg: any, ctx: any) => any;
            base: (_msg: any, ctx: any) => any;
            zone: (_msg: any, ctx: any) => any;
        };
        prepareCtx: (msg: any, ctx: any) => any;
        handleResponse: {
            any: (seneca: any, ctx: any, reply: any, err: Error, res: any, apimsg: any, _apimeta: any, logn: any) => any;
            list: (seneca: any, ctx: any, reply: any, err: Error, res: any, _apimsg: any, _apimeta: any, logn: any) => void;
        };
    };
}
export default BrowserStore;

export { }


declare namespace BrowserStore {
    var defaults: {
        debug: boolean;
        apimsg: {
            aim: string;
            on: string;
            q: (msg: any, _ctx: any) => any;
            ent: (msg: any, _ctx: any) => any;
            save: (_msg: any, ctx: any) => "entity" | undefined;
            load: (_msg: any, ctx: any) => "entity" | undefined;
            list: (_msg: any, ctx: any) => "entity" | undefined;
            remove: (_msg: any, ctx: any) => "entity" | undefined;
            store: (_msg: any, ctx: any) => any;
            name: (_msg: any, ctx: any) => any;
            base: (_msg: any, ctx: any) => any;
            zone: (_msg: any, ctx: any) => any;
        };
        prepareCtx: (msg: any, ctx: any) => any;
        handleResponse: {
            any: (seneca: any, ctx: any, reply: any, err: Error, res: any, apimsg: any, _apimeta: any, logn: any) => any;
            list: (seneca: any, ctx: any, reply: any, err: Error, res: any, _apimsg: any, _apimeta: any, logn: any) => void;
        };
    };
}

