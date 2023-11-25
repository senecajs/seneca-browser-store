/* Copyright (c) 2023 Richard Rodger and other contributors, MIT License */

function BrowserStore(this: any, options: any) {
  let seneca: any = this

  let init = seneca.export('entity/init')

  let ohr = options.handleResponse
  let handleResponse = ['save', 'load', 'list', 'remove'].reduce(
    (a: any, n) => ((a[n] = ohr[n] || ohr.any), a),
    {},
  )

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

    save: function (this: any, msg: any, reply: any) {
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      this.act(apimsg, function save_result(this: any, err: Error, out: any) {
        return handleResponse.save(this, ctx, reply, err, out)
      })
    },

    load: function (this: any, msg: any, reply: any) {
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      this.act(apimsg, function load_result(this: any, err: Error, out: any) {
        return handleResponse.load(this, ctx, reply, err, out)
      })
    },

    list: function (this: any, msg: any, reply: any) {
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      // console.log(apimsg, ctx)
      // return reply()

      this.act(apimsg, function list_result(this: any, err: Error, out: any) {
        return handleResponse.list(this, ctx, reply, err, out)
      })
    },

    remove: function (this: any, msg: any, reply: any) {
      let ctx = options.prepareCtx(msg)
      let apimsg = makeApiMsg(msg, ctx, options)

      this.act(apimsg, function remove_result(this: any, err: Error, out: any) {
        return handleResponse.remove(this, ctx, reply, err, out)
      })
    },

    close: function (this: any, _msg: any, reply: any) {
      reply()
    },

    native: function (this: any, _msg: any, reply: any) {
      reply()
    },
  }

  let meta = init(seneca, options, store)

  return {
    name: store.name,
    tag: meta.tag,
    exports: {
      makeApiMsg,
    },
  }
}

BrowserStore.defaults = {
  apimsg: {
    aim: 'req',
    on: 'entity',
    debounce$: true,
    q: (msg: any, ctx: any) => msg.q,
    ent: (msg: any, ctx: any) => msg.ent,
    cmd: (msg: any, ctx: any) => ctx.cmd,
    canon: (msg: any, ctx: any) => (msg.ent || msg.qent).entity$,
    store: (msg: any, ctx: any) => ctx.store,
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
    any: function (seneca: any, ctx: any, reply: any, err: Error, out: any) {
      if (err) reply(err)

      if (out && out.ok && (out.ent || 'remove' === ctx.cmd)) {
        reply(out.ent)
      } else {
        reply(
          (out && out.err) ||
            new Error(
              'BrowserStore: ' + ctx.cmd + ' ' + ctx.canon + ': unknown error',
            ),
        )
      }
    },

    list: function (seneca: any, ctx: any, reply: any, err: Error, out: any) {
      if (err) reply(err)

      if (out && out.ok && out.list) {
        let list = out.list.map((item: any) =>
          seneca.entity(ctx.canon).data$(item),
        )
        reply(list)
      } else {
        reply(
          (out && out.err) ||
            new Error(
              'BrowserStore: ' +
                ctx.cmd +
                ' ' +
                ctx.canon +
                ': unknown list error',
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
