/* Copyright (c) 2023 Richard Rodger and other contributors, MIT License */

function BrowserStore(this: any, options: any) {
  let seneca: any = this

  let init = seneca.export('entity/init')

  let ohr = options.handleResponse
  let handleResponse = ['save', 'load', 'list', 'remove'].reduce(
    (a: any, n) => ((a[n] = ohr[n] || ohr.any), a),
    {},
  )

  const msglog: {
    msg: any
    meta: any
    start: number
    ctx?: any
    apimsg?: any
    res?: any
    err?: any
    apimeta?: any
    apiend?: number
    end?: number
  }[] = []

  function makeApiMsg(msg: any, ctx: any, options: any) {
    let apimsg: any = {}
    let apimsgtm = options.apimsg

    for (let pn in apimsgtm) {
      let pv = apimsgtm[pn]
      if ('function' === typeof pv) {
        apimsg[pn] = pv(msg, ctx, options)
      } else {
        apimsg[pn] = JSON.parse(JSON.stringify(pv))
      }
    }

    return apimsg
  }

  let store = {
    name: 'BrowserStore',

    save: function (this: any, msg: any, reply: any, _meta: any) {
      let logn = options.debug && logstart(arguments)
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      logn && (logn.ctx = ctx) && (logn.apimsg = apimsg)
      this.act(
        apimsg,
        function save_result(this: any, err: Error, res: any, apimeta: any) {
          logn &&
            (logn.apiend = Date.now()) &&
            (logn.err = err) &&
            (logn.res = res) &&
            (logn.apimeta = apimeta)
          return handleResponse.save(this, ctx, reply, err, res, apimeta, logn)
        },
      )
    },

    load: function (this: any, msg: any, reply: any, _meta: any) {
      let logn = options.debug && logstart(arguments)
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      logn && (logn.ctx = ctx) && (logn.apimsg = apimsg)
      this.act(
        apimsg,
        function load_result(this: any, err: Error, res: any, apimeta: any) {
          logn && logres(logn, arguments)
          return handleResponse.load(this, ctx, reply, err, res, apimeta, logn)
        },
      )
    },

    list: function (this: any, msg: any, reply: any, _meta: any) {
      let logn = options.debug && logstart(arguments)
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      logn && (logn.ctx = ctx) && (logn.apimsg = apimsg)
      this.act(
        apimsg,
        function list_result(this: any, err: Error, res: any, apimeta: any) {
          logn && logres(logn, arguments)
          return handleResponse.list(this, ctx, reply, err, res, apimeta, logn)
        },
      )
    },

    remove: function (this: any, msg: any, reply: any, _meta: any) {
      let logn = options.debug && logstart(arguments)
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      logn && (logn.ctx = ctx) && (logn.apimsg = apimsg)
      this.act(
        apimsg,
        function remove_result(this: any, err: Error, res: any, apimeta: any) {
          logn && logres(logn, arguments)
          return handleResponse.remove(
            this,
            ctx,
            reply,
            err,
            res,
            apimeta,
            logn,
          )
        },
      )
    },

    close: function (this: any, _msg: any, reply: any) {
      reply()
    },

    native: function (this: any, _msg: any, reply: any) {
      reply()
    },
  }

  let meta = init(seneca, options, store)

  function logstart(args: any) {
    let logn = options.debug && {
      msg: args[0],
      meta: args[2],
      start: Date.now(),
    }
    logn && msglog.push(logn)
    return logn
  }

  function logres(logn: any, args: any) {
    logn.apiend = Date.now()
    logn.err = args[0]
    logn.res = args[1]
    logn.apimeta = args[2]
    return logn
  }

  return {
    name: store.name,
    tag: meta.tag,
    exports: {
      makeApiMsg,
      msglog,
    },
  }
}

BrowserStore.defaults = {
  debug: false,

  apimsg: {
    aim: 'req',
    on: 'entity',
    debounce$: true,
    q: (msg: any, _ctx: any) => msg.q,
    ent: (msg: any, _ctx: any) => msg.ent,
    cmd: (_msg: any, ctx: any) => ctx.cmd,
    canon: (msg: any, _ctx: any) => (msg.ent || msg.qent).entity$,
    store: (_msg: any, ctx: any) => ctx.store,
  },

  prepareCtx: (msg: any, ctx: any) => {
    ctx = ctx || {}

    let q = msg.q
    ctx.store = false !== q.store$
    delete q.store$

    ctx.cmd = msg.cmd
    ctx.canon = (msg.ent || msg.qent).entity$

    return ctx
  },

  handleResponse: {
    any: function (
      _seneca: any,
      ctx: any,
      reply: any,
      err: Error,
      res: any,
      _apimeta: any,
      logn: any,
    ) {
      logn && (logn.end = Date.now())

      if (err) {
        reply(err)
      }

      if (res && res.ok) {
        reply(res.ent)
      } else {
        reply(
          (res && res.err) ||
            new Error(`BrowserStore: ${ctx.cmd} ${ctx.canon}: unknown error`),
        )
      }
    },

    list: function (
      seneca: any,
      ctx: any,
      reply: any,
      err: Error,
      res: any,
      _apimeta: any,
      logn: any,
    ) {
      logn && (logn.end = Date.now())
      if (err) reply(err)

      if (res && res.ok && res.list) {
        let list = res.list.map((item: any) =>
          seneca.entity(ctx.canon).data$(item),
        )
        logn && (logn.end = Date.now())
        reply(list)
      } else {
        reply(
          (res && res.err) ||
            new Error(
              `BrowserStore: ${ctx.cmd} ${ctx.canon}: unknown list error`,
            ),
        )
      }
    },
  },
}

export default BrowserStore

if ('undefined' !== typeof module) {
  module.exports = BrowserStore
}
