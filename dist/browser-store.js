"use strict";
/* Copyright (c) 2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
function BrowserStore(options) {
    let seneca = this;
    let init = seneca.export('entity/init');
    let ohr = options.handleResponse;
    let handleResponse = ['save', 'load', 'list', 'remove']
        .reduce((a, n) => (a[n] = (ohr[n] || ohr.any), a), {});
    function makeApiMsg(msg, ctx, options) {
        let apimsg = {};
        let apimsgtm = options.apimsg;
        for (let pn in apimsgtm) {
            let pv = apimsgtm[pn];
            if ('function' === typeof pv) {
                apimsg[pn] = pv(msg, ctx, options);
            }
            else {
                apimsg[pn] = JSON.parse(JSON.stringify(pv));
            }
        }
        return apimsg;
    }
    let store = {
        name: 'BrowserStore',
        save: function (msg, reply) {
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            this.act(apimsg, function save_result(err, out) {
                return handleResponse.save(this, ctx, reply, err, out);
            });
        },
        load: function (msg, reply) {
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            this.act(apimsg, function load_result(err, out) {
                return handleResponse.load(this, ctx, reply, err, out);
            });
        },
        list: function (msg, reply) {
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            // console.log(apimsg, ctx)
            // return reply()
            this.act(apimsg, function list_result(err, out) {
                return handleResponse.list(this, ctx, reply, err, out);
            });
        },
        remove: function (msg, reply) {
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            this.act(apimsg, function remove_result(err, out) {
                return handleResponse.remove(this, ctx, reply, err, out);
            });
        },
        close: function (_msg, reply) {
            reply();
        },
        native: function (_msg, reply) {
            reply();
        },
    };
    let meta = init(seneca, options, store);
    return {
        name: store.name,
        tag: meta.tag,
        exports: {
            makeApiMsg,
        }
    };
}
BrowserStore.defaults = {
    apimsg: {
        req: 'web',
        on: 'entity',
        debounce$: true,
        q: (msg, ctx) => msg.q,
        ent: (msg, ctx) => msg.ent,
        cmd: (msg, ctx) => ctx.cmd,
        canon: (msg, ctx) => (msg.ent || msg.qent).entity$,
        store: (msg, ctx) => ctx.store,
    },
    prepareCtx: (msg, ctx) => {
        ctx = ctx || {};
        let q = msg.q;
        ctx.store = false !== q.store$;
        delete q.store$;
        ctx.cmd = msg.cmd;
        ctx.canon = (msg.ent || msg.qent).entity$;
        return ctx;
    },
    handleResponse: {
        any: function (seneca, ctx, reply, err, out) {
            if (err)
                reply(err);
            if (out && out.ok && (out.ent || 'remove' === ctx.cmd)) {
                reply(out.ent);
            }
            else {
                reply(out && out.err ||
                    new Error('BrowserStore: ' + ctx.cmd + ' ' + ctx.canon + ': unknown error'));
            }
        },
        list: function (seneca, ctx, reply, err, out) {
            if (err)
                reply(err);
            if (out && out.ok && out.list) {
                let list = out.list.map((item) => seneca.entity(ctx.canon).data$(item));
                reply(list);
            }
            else {
                reply(out && out.err ||
                    new Error('BrowserStore: ' + ctx.cmd + ' ' + ctx.canon + ': unknown list error'));
            }
        }
    }
};
exports.default = BrowserStore;
if ('undefined' !== typeof (module)) {
    module.exports = BrowserStore;
}
//# sourceMappingURL=browser-store.js.map