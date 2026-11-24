function q(s) {
  let n = this, e = n.export("entity/init"), d = s.handleResponse, o = ["save", "load", "list", "remove"].reduce(
    (t, r) => (t[r] = d[r] || d.any, t),
    {}
  );
  const i = [];
  function c(t, r, p) {
    let a = {}, u = p.apimsg;
    for (let l in u) {
      let _ = u[l];
      typeof _ == "function" ? a[l] = _(t, r, p) : a[l] = JSON.parse(JSON.stringify(_));
    }
    return a;
  }
  let w = {
    name: "BrowserStore",
    save: function(t, r, p) {
      let a = s.debug && m(arguments), u = s.prepareCtx(t), l = c(t, u, s);
      if (l.q.add$ === !0 && l.ent.id == null && l.ent.id$ == null)
        return o.save(
          this,
          u,
          r,
          null,
          { ok: !0, item: l.ent },
          l,
          f,
          a
        );
      a && g(a, u, l), this.act(
        l,
        function(v, $, b) {
          return a && h(a, arguments), o.save(
            this,
            u,
            r,
            v,
            $,
            l,
            b,
            a
          );
        }
      );
    },
    load: function(t, r, p) {
      let a = s.debug && m(arguments), u = s.prepareCtx(t), l = c(t, u, s);
      a && g(a, u, l), this.act(
        l,
        function(v, $, b) {
          return a && h(a, arguments), o.load(
            this,
            u,
            r,
            v,
            $,
            l,
            b,
            a
          );
        }
      );
    },
    list: function(t, r, p) {
      let a = s.debug && m(arguments), u = s.prepareCtx(t), l = c(t, u, s);
      a && g(a, u, l), this.act(
        l,
        function(v, $, b) {
          return a && h(a, arguments), o.list(
            this,
            u,
            r,
            v,
            $,
            l,
            b,
            a
          );
        }
      );
    },
    remove: function(t, r, p) {
      let a = s.debug && m(arguments), u = s.prepareCtx(t), l = c(t, u, s);
      a && g(a, u, l), this.act(
        l,
        function(v, $, b) {
          return a && h(a, arguments), o.remove(
            this,
            u,
            r,
            v,
            $,
            l,
            b,
            a
          );
        }
      );
    },
    close: function(t, r) {
      r();
    },
    native: function(t, r) {
      r();
    }
  }, f = e(n, s, w);
  function m(t) {
    let r = s.debug && {
      msg: t[0],
      meta: t[2],
      start: Date.now()
    };
    return r && i.push(r), r;
  }
  function g(t, r, p) {
    return t.apistart = Date.now(), t.ctx = r, t.apimsg = p, t;
  }
  function h(t, r) {
    return t.apiend = Date.now(), t.err = r[0], t.res = r[1], t.apimeta = r[2], t;
  }
  return {
    name: w.name,
    tag: f.tag,
    exports: {
      makeApiMsg: c,
      msglog: i
    }
  };
}
function y(s, n) {
  return s.entity(n.zone, n.base, n.name).canon$();
}
q.defaults = ({ valid: s }) => ({
  debug: !1,
  // Entity canon map for entity/init: { 'zone/base/name': cmds }.
  map: s.Default(void 0, {}),
  apimsg: s.Open({
    aim: "req",
    on: "entity",
    // debounce$: true,
    q: (n, e) => n.q,
    ent: (n, e) => n.ent,
    // cmd: (_msg: any, ctx: any) => ctx.cmd,
    save: (n, e) => e.cmd === "save" ? "entity" : void 0,
    load: (n, e) => e.cmd === "load" ? "entity" : void 0,
    list: (n, e) => e.cmd === "list" ? "entity" : void 0,
    remove: (n, e) => e.cmd === "remove" ? "entity" : void 0,
    store: (n, e) => e.store,
    name: (n, e) => e.name,
    base: (n, e) => e.base,
    zone: (n, e) => e.zone
  }),
  prepareCtx: (n, e) => {
    e = e || {};
    let d = n.q;
    e.store = d.store$ !== !1, delete d.store$, e.cmd = n.cmd;
    let o = n.ent || n.qent;
    if (o) {
      if (o.canon$)
        Object.assign(e, o.canon$({ object: !0 }));
      else if (o.entity$) {
        let i = o.entity$.split("/");
        Object.assign(e, {
          zone: i[0] === "-" ? null : i[0],
          base: i[1] === "-" ? null : i[1],
          name: i[2] === "-" ? null : i[2]
        });
      }
    }
    return e;
  },
  handleResponse: s.Open({
    any: function(n, e, d, o, i, c, w, f) {
      if (f && (f.end = Date.now()), o)
        return d(o);
      if (c.load === "entity" && (i == null || i.ok == null))
        return d(null);
      if (i && i.ok && i.item) {
        let m = [e.zone, e.base, e.name], g = n.entity(...m);
        return d(g.clone$().data$(i.item));
      } else {
        let m = i && i.err;
        return m = m || new Error(
          `BrowserStore: ${e.cmd} ${y(n, e)}: unknown error`
        ), d(m);
      }
    },
    list: function(n, e, d, o, i, c, w, f) {
      if (f && (f.end = Date.now()), o && d(o), i && i.ok && i.list) {
        let m = [e.zone, e.base, e.name], g = n.entity(...m), h = i.list.map((t) => g.clone$().data$(t));
        f && (f.end = Date.now()), d(h);
      } else {
        let m = i && i.err;
        m = m || new Error(
          `BrowserStore: ${e.cmd} ${y(
            n,
            e
          )}: unknown list error`
        ), d(m);
      }
    }
  })
});
Object.defineProperty(q, "name", { value: "BrowserStore" });
export {
  q as default
};
//# sourceMappingURL=browser-store.es.js.map
