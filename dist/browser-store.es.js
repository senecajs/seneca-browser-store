console.log("BrowserStore 3");
function y(t) {
  let e = this, m = e.export("entity/init"), o = t.handleResponse, a = ["save", "load", "list", "remove"].reduce(
    (n, l) => (n[l] = o[l] || o.any, n),
    {}
  );
  const h = [];
  function g(n, l, f) {
    let r = {}, s = f.apimsg;
    for (let i in s) {
      let _ = s[i];
      typeof _ == "function" ? r[i] = _(n, l, f) : r[i] = JSON.parse(JSON.stringify(_));
    }
    return r;
  }
  let d = {
    name: "BrowserStore",
    save: function(n, l, f) {
      let r = t.debug && c(arguments), s = t.prepareCtx(n), i = g(n, s, t);
      if (i.q.add$ === !0 && i.ent.id == null && i.ent.id$ == null)
        return a.save(
          this,
          s,
          l,
          null,
          { ok: !0, item: i.ent },
          i,
          u,
          r
        );
      r && b(r, s, i), this.act(
        i,
        function(p, v, $) {
          return r && w(r, arguments), a.save(
            this,
            s,
            l,
            p,
            v,
            i,
            $,
            r
          );
        }
      );
    },
    load: function(n, l, f) {
      let r = t.debug && c(arguments), s = t.prepareCtx(n), i = g(n, s, t);
      r && b(r, s, i), this.act(
        i,
        function(p, v, $) {
          return r && w(r, arguments), a.load(
            this,
            s,
            l,
            p,
            v,
            i,
            $,
            r
          );
        }
      );
    },
    list: function(n, l, f) {
      let r = t.debug && c(arguments), s = t.prepareCtx(n), i = g(n, s, t);
      console.log("BS-list", i), r && b(r, s, i), this.act(
        i,
        function(p, v, $) {
          return r && w(r, arguments), a.list(
            this,
            s,
            l,
            p,
            v,
            i,
            $,
            r
          );
        }
      );
    },
    remove: function(n, l, f) {
      let r = t.debug && c(arguments), s = t.prepareCtx(n), i = g(n, s, t);
      r && b(r, s, i), this.act(
        i,
        function(p, v, $) {
          return r && w(r, arguments), a.remove(
            this,
            s,
            l,
            p,
            v,
            i,
            $,
            r
          );
        }
      );
    },
    close: function(n, l) {
      l();
    },
    native: function(n, l) {
      l();
    }
  }, u = m(e, t, d);
  function c(n) {
    let l = t.debug && {
      msg: n[0],
      meta: n[2],
      start: Date.now()
    };
    return l && h.push(l), l;
  }
  function b(n, l, f) {
    return n.apistart = Date.now(), n.ctx = l, n.apimsg = f, n;
  }
  function w(n, l) {
    return n.apiend = Date.now(), n.err = l[0], n.res = l[1], n.apimeta = l[2], n;
  }
  return {
    name: d.name,
    tag: u.tag,
    exports: {
      makeApiMsg: g,
      msglog: h
    }
  };
}
function S(t, e) {
  return t.entity(e.zone, e.base, e.name).canon$();
}
y.defaults = {
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
    let o = t.ent || t.qent;
    if (o) {
      if (o.canon$)
        Object.assign(e, o.canon$({ object: !0 }));
      else if (o.entity$) {
        let a = o.entity$.split("/");
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
    any: function(t, e, m, o, a, h, g, d) {
      if (d && (d.end = Date.now()), o)
        return m(o);
      if (h.load === "entity" && (a == null || a.ok == null))
        return m(null);
      if (a && a.ok && a.item) {
        let u = [e.zone, e.base, e.name], c = t.entity(...u);
        return m(c.clone$().data$(a.item));
      } else {
        let u = a && a.err;
        return u = u || new Error(
          `BrowserStore: ${e.cmd} ${S(t, e)}: unknown error`
        ), m(u);
      }
    },
    list: function(t, e, m, o, a, h, g, d) {
      if (d && (d.end = Date.now()), console.log("BS-LIST-RES", a, o), o && m(o), a && a.ok && a.list) {
        let u = [e.zone, e.base, e.name], c = t.entity(...u), b = a.list.map((w) => c.clone$().data$(w));
        d && (d.end = Date.now()), m(b);
      } else {
        let u = a && a.err;
        u = u || new Error(
          `BrowserStore: ${e.cmd} ${S(
            t,
            e
          )}: unknown list error`
        ), m(u);
      }
    }
  }
};
Object.defineProperty(y, "name", { value: "BrowserStore" });
export {
  y as default
};
//# sourceMappingURL=browser-store.es.js.map
