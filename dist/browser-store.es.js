function q(t) {
  let e = this, m = e.export("entity/init"), u = t.handleResponse, a = ["save", "load", "list", "remove"].reduce(
    (n, i) => (n[i] = u[i] || u.any, n),
    {}
  );
  const w = [];
  function g(n, i, c) {
    let r = {}, s = c.apimsg;
    for (let l in s) {
      let _ = s[l];
      typeof _ == "function" ? r[l] = _(n, i, c) : r[l] = JSON.parse(JSON.stringify(_));
    }
    return r;
  }
  let d = {
    name: "BrowserStore",
    save: function(n, i, c) {
      let r = t.debug && f(arguments), s = t.prepareCtx(n), l = g(n, s, t);
      if (l.q.add$ === !0 && l.ent.id == null && l.ent.id$ == null)
        return a.save(
          this,
          s,
          i,
          null,
          { ok: !0, item: l.ent },
          l,
          o,
          r
        );
      r && b(r, s, l), this.act(
        l,
        function(p, v, $) {
          return r && h(r, arguments), a.save(
            this,
            s,
            i,
            p,
            v,
            l,
            $,
            r
          );
        }
      );
    },
    load: function(n, i, c) {
      let r = t.debug && f(arguments), s = t.prepareCtx(n), l = g(n, s, t);
      r && b(r, s, l), this.act(
        l,
        function(p, v, $) {
          return r && h(r, arguments), a.load(
            this,
            s,
            i,
            p,
            v,
            l,
            $,
            r
          );
        }
      );
    },
    list: function(n, i, c) {
      let r = t.debug && f(arguments), s = t.prepareCtx(n), l = g(n, s, t);
      r && b(r, s, l), this.act(
        l,
        function(p, v, $) {
          return r && h(r, arguments), a.list(
            this,
            s,
            i,
            p,
            v,
            l,
            $,
            r
          );
        }
      );
    },
    remove: function(n, i, c) {
      let r = t.debug && f(arguments), s = t.prepareCtx(n), l = g(n, s, t);
      r && b(r, s, l), this.act(
        l,
        function(p, v, $) {
          return r && h(r, arguments), a.remove(
            this,
            s,
            i,
            p,
            v,
            l,
            $,
            r
          );
        }
      );
    },
    close: function(n, i) {
      i();
    },
    native: function(n, i) {
      i();
    }
  }, o = m(e, t, d);
  function f(n) {
    let i = t.debug && {
      msg: n[0],
      meta: n[2],
      start: Date.now()
    };
    return i && w.push(i), i;
  }
  function b(n, i, c) {
    return n.apistart = Date.now(), n.ctx = i, n.apimsg = c, n;
  }
  function h(n, i) {
    return n.apiend = Date.now(), n.err = i[0], n.res = i[1], n.apimeta = i[2], n;
  }
  return {
    name: d.name,
    tag: o.tag,
    exports: {
      makeApiMsg: g,
      msglog: w
    }
  };
}
function y(t, e) {
  return t.entity(e.zone, e.base, e.name).canon$();
}
q.defaults = {
  debug: !1,
  apimsg: {
    aim: "req",
    on: "entity",
    // debounce$: true,
    q: (t, e) => t.q,
    ent: (t, e) => t.ent,
    // cmd: (_msg: any, ctx: any) => ctx.cmd,
    save: (t, e) => e.cmd === "save" ? "entity" : void 0,
    load: (t, e) => e.cmd === "load" ? "entity" : void 0,
    list: (t, e) => e.cmd === "list" ? "entity" : void 0,
    remove: (t, e) => e.cmd === "remove" ? "entity" : void 0,
    store: (t, e) => e.store,
    name: (t, e) => e.name,
    base: (t, e) => e.base,
    zone: (t, e) => e.zone
  },
  prepareCtx: (t, e) => {
    e = e || {};
    let m = t.q;
    e.store = m.store$ !== !1, delete m.store$, e.cmd = t.cmd;
    let u = t.ent || t.qent;
    if (u) {
      if (u.canon$)
        Object.assign(e, u.canon$({ object: !0 }));
      else if (u.entity$) {
        let a = u.entity$.split("/");
        Object.assign(e, {
          zone: a[0] === "-" ? null : a[0],
          base: a[1] === "-" ? null : a[1],
          name: a[2] === "-" ? null : a[2]
        });
      }
    }
    return e;
  },
  handleResponse: {
    any: function(t, e, m, u, a, w, g, d) {
      if (d && (d.end = Date.now()), u)
        return m(u);
      if (w.load === "entity" && (a == null || a.ok == null))
        return m(null);
      if (a && a.ok && a.item) {
        let o = [e.zone, e.base, e.name], f = t.entity(...o);
        return m(f.clone$().data$(a.item));
      } else {
        let o = a && a.err;
        return o = o || new Error(
          `BrowserStore: ${e.cmd} ${y(t, e)}: unknown error`
        ), m(o);
      }
    },
    list: function(t, e, m, u, a, w, g, d) {
      if (d && (d.end = Date.now()), u && m(u), a && a.ok && a.list) {
        let o = [e.zone, e.base, e.name], f = t.entity(...o), b = a.list.map((h) => f.clone$().data$(h));
        d && (d.end = Date.now()), m(b);
      } else {
        let o = a && a.err;
        o = o || new Error(
          `BrowserStore: ${e.cmd} ${y(
            t,
            e
          )}: unknown list error`
        ), m(o);
      }
    }
  }
};
Object.defineProperty(q, "name", { value: "BrowserStore" });
export {
  q as default
};
//# sourceMappingURL=browser-store.es.js.map
