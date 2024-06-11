/* Copyright (c) 2023-2024 Richard Rodger and other contributors, MIT License */

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

      // console.log('SAVE', msg, apimsg)

      // Provide a new entity with no id for saving later.
      if (
        true === apimsg.q.add$ &&
        null == apimsg.ent.id &&
        null == apimsg.ent.id$
      ) {
        return handleResponse.save(
          this,
          ctx,
          reply,
          null,
          { ok: true, item: apimsg.ent },
          apimsg,
          meta,
          logn,
        )
      }

      logn && logreq(logn, ctx, apimsg)
      this.act(
        apimsg,
        function save_result(this: any, err: Error, res: any, apimeta: any) {
          logn && logres(logn, arguments)
          return handleResponse.save(
            this,
            ctx,
            reply,
            err,
            res,
            apimsg,
            apimeta,
            logn,
          )
        },
      )
    },

    load: function (this: any, msg: any, reply: any, meta: any) {
      let logn = options.debug && logstart(arguments)
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      logn && logreq(logn, ctx, apimsg)
      this.act(
        apimsg,
        function load_result(this: any, err: Error, res: any, apimeta: any) {
          logn && logres(logn, arguments)
          return handleResponse.load(
            this,
            ctx,
            reply,
            err,
            res,
            apimsg,
            apimeta,
            logn,
          )
        },
      )
    },

    list: function (this: any, msg: any, reply: any, _meta: any) {
      let logn = options.debug && logstart(arguments)
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      // console.log('BS-list', apimsg)

      logn && logreq(logn, ctx, apimsg)
      this.act(
        apimsg,
        function list_result(this: any, err: Error, res: any, apimeta: any) {
          logn && logres(logn, arguments)
          return handleResponse.list(
            this,
            ctx,
            reply,
            err,
            res,
            apimsg,
            apimeta,
            logn,
          )
        },
      )
    },

    remove: function (this: any, msg: any, reply: any, _meta: any) {
      let logn = options.debug && logstart(arguments)
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      logn && logreq(logn, ctx, apimsg)
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
            apimsg,
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

  function logreq(logn: any, ctx: any, apimsg: any) {
    logn.apistart = Date.now()
    logn.ctx = ctx
    logn.apimsg = apimsg
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

function canonStr(seneca: any, ctx: any) {
  return seneca.entity(ctx.zone, ctx.base, ctx.name).canon$()
}

BrowserStore.defaults = {
  debug: false,

  apimsg: {
    aim: 'req',
    on: 'entity',
    // debounce$: true,
    q: (msg: any, _ctx: any) => msg.q,
    ent: (msg: any, _ctx: any) => msg.ent,
    // cmd: (_msg: any, ctx: any) => ctx.cmd,
    save: (_msg: any, ctx: any) => ('save' === ctx.cmd ? 'entity' : undefined),
    load: (_msg: any, ctx: any) => ('load' === ctx.cmd ? 'entity' : undefined),
    list: (_msg: any, ctx: any) => ('list' === ctx.cmd ? 'entity' : undefined),
    remove: (_msg: any, ctx: any) =>
      'remove' === ctx.cmd ? 'entity' : undefined,
    store: (_msg: any, ctx: any) => ctx.store,
    name: (_msg: any, ctx: any) => ctx.name,
    base: (_msg: any, ctx: any) => ctx.base,
    zone: (_msg: any, ctx: any) => ctx.zone,
  },

  prepareCtx: (msg: any, ctx: any) => {
    ctx = ctx || {}

    let q = msg.q
    ctx.store = false !== q.store$
    delete q.store$

    ctx.cmd = msg.cmd

    let ent = msg.ent || msg.qent

    if (ent) {
      if (ent.canon$) {
        Object.assign(ctx, ent.canon$({ object: true }))
      } else if (ent.entity$) {
        let parts = ent.entity$.split('/')
        Object.assign(ctx, {
          zone: '-' === parts[0] ? null : parts[0],
          base: '-' === parts[1] ? null : parts[1],
          name: '-' === parts[2] ? null : parts[2],
        })
      }
    }

    return ctx
  },

  handleResponse: {
    any: function (
      seneca: any,
      ctx: any,
      reply: any,
      err: Error,
      res: any,
      apimsg: any,
      _apimeta: any,
      logn: any,
    ) {
      logn && (logn.end = Date.now())

      if (err) {
        return reply(err)
      }

      // TODO: debounce response could be empty object - review
      if ('entity' === apimsg.load && (null == res || null == res.ok)) {
        return reply(null)
      }

      if (res && res.ok && res.item) {
        let canon = [ctx.zone, ctx.base, ctx.name]
        let ent = seneca.entity(...canon)

        // TODO: FIX entity make$() should already have canon
        return reply(ent.clone$().data$(res.item))
      } else {
        let err = res && res.err
        err =
          err ||
          new Error(
            `BrowserStore: ${ctx.cmd} ${canonStr(seneca, ctx)}: unknown error`,
          )
        return reply(err)
      }
    },

    list: function (
      seneca: any,
      ctx: any,
      reply: any,
      err: Error,
      res: any,
      _apimsg: any,
      _apimeta: any,
      logn: any,
    ) {
      logn && (logn.end = Date.now())

      // console.log('BS-LIST-RES', res, err)

      if (err) {
        reply(err)
      }

      if (res && res.ok && res.list) {
        let canon = [ctx.zone, ctx.base, ctx.name]
        let ent = seneca.entity(...canon)

        let list = res.list.map((item: any) => ent.clone$().data$(item))
        logn && (logn.end = Date.now())
        reply(list)
      } else {
        let err = res && res.err
        err =
          err ||
          new Error(
            `BrowserStore: ${ctx.cmd} ${canonStr(
              seneca,
              ctx,
            )}: unknown list error`,
          )
        reply(err)
      }
    },
  },
}

// Prevent name mangling
Object.defineProperty(BrowserStore, 'name', { value: 'BrowserStore' })

export default BrowserStore
