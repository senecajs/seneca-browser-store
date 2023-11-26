"use strict";
/* Copyright (c) 2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
function BrowserStore(options) {
    let seneca = this;
    let init = seneca.export('entity/init');
    let ohr = options.handleResponse;
    let handleResponse = ['save', 'load', 'list', 'remove'].reduce((a, n) => ((a[n] = ohr[n] || ohr.any), a), {});
    const msglog = [];
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
        save: function (msg, reply, _meta) {
            let logn = options.debug && logstart(arguments);
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            logn && (logn.ctx = ctx) && (logn.apimsg = apimsg);
            this.act(apimsg, function save_result(err, res, apimeta) {
                logn &&
                    (logn.apiend = Date.now()) &&
                    (logn.err = err) &&
                    (logn.res = res) &&
                    (logn.apimeta = apimeta);
                return handleResponse.save(this, ctx, reply, err, res, apimeta, logn);
            });
        },
        load: function (msg, reply, _meta) {
            let logn = options.debug && logstart(arguments);
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            logn && (logn.ctx = ctx) && (logn.apimsg = apimsg);
            this.act(apimsg, function load_result(err, res, apimeta) {
                logn && logres(logn, arguments);
                return handleResponse.load(this, ctx, reply, err, res, apimeta, logn);
            });
        },
        list: function (msg, reply, _meta) {
            let logn = options.debug && logstart(arguments);
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            logn && (logn.ctx = ctx) && (logn.apimsg = apimsg);
            this.act(apimsg, function list_result(err, res, apimeta) {
                logn && logres(logn, arguments);
                return handleResponse.list(this, ctx, reply, err, res, apimeta, logn);
            });
        },
        remove: function (msg, reply, _meta) {
            let logn = options.debug && logstart(arguments);
            let ctx = options.prepareCtx(msg);
            let apimsg = makeApiMsg(msg, ctx, options);
            logn && (logn.ctx = ctx) && (logn.apimsg = apimsg);
            this.act(apimsg, function remove_result(err, res, apimeta) {
                logn && logres(logn, arguments);
                return handleResponse.remove(this, ctx, reply, err, res, apimeta, logn);
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
    function logstart(args) {
        let logn = options.debug && {
            msg: args[0],
            meta: args[2],
            start: Date.now(),
        };
        logn && msglog.push(logn);
        return logn;
    }
    function logres(logn, args) {
        logn.apiend = Date.now();
        logn.err = args[0];
        logn.res = args[1];
        logn.apimeta = args[2];
        return logn;
    }
    return {
        name: store.name,
        tag: meta.tag,
        exports: {
            makeApiMsg,
            msglog,
        },
    };
}
BrowserStore.defaults = {
    debug: false,
    apimsg: {
        aim: 'req',
        on: 'entity',
        debounce$: true,
        q: (msg, _ctx) => msg.q,
        ent: (msg, _ctx) => msg.ent,
        cmd: (_msg, ctx) => ctx.cmd,
        canon: (msg, _ctx) => (msg.ent || msg.qent).entity$,
        store: (_msg, ctx) => ctx.store,
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
        any: function (_seneca, ctx, reply, err, res, _apimeta, logn) {
            logn && (logn.end = Date.now());
            if (err) {
                reply(err);
            }
            if (res && res.ok) {
                reply(res.ent);
            }
            else {
                reply((res && res.err) ||
                    new Error(`BrowserStore: ${ctx.cmd} ${ctx.canon}: unknown error`));
            }
        },
        list: function (seneca, ctx, reply, err, res, _apimeta, logn) {
            logn && (logn.end = Date.now());
            if (err)
                reply(err);
            if (res && res.ok && res.list) {
                let list = res.list.map((item) => seneca.entity(ctx.canon).data$(item));
                logn && (logn.end = Date.now());
                reply(list);
            }
            else {
                reply((res && res.err) ||
                    new Error(`BrowserStore: ${ctx.cmd} ${ctx.canon}: unknown list error`));
            }
        },
    },
};
exports.default = BrowserStore;
if ('undefined' !== typeof module) {
    module.exports = BrowserStore;
}
//# sourceMappingURL=browser-store.js.map