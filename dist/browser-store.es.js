function k(t) {
  let e = this, m = e.export("entity/init"), u = t.handleResponse, a = ["save", "load", "list", "remove"].reduce(
    (n, i) => (n[i] = u[i] || u.any, n),
    {}
  );
  const w = [];
  function c(n, i, f) {
    let r = {}, s = f.apimsg;
    for (let l in s) {
      let g = s[l];
      typeof g == "function" ? r[l] = g(n, i, f) : r[l] = JSON.parse(JSON.stringify(g));
    }
    return r;
  }
  let d = {
    name: "BrowserStore",
    save: function(n, i, f) {
      let r = t.debug && v(arguments), s = t.prepareCtx(n), l = c(n, s, t);
      r && $(r, s, l), this.act(
        l,
        function(_, p, b) {
          return r && h(r, arguments), a.save(
            this,
            s,
            i,
            _,
            p,
            l,
            b,
            r
          );
        }
      );
    },
    load: function(n, i, f) {
      let r = t.debug && v(arguments), s = t.prepareCtx(n), l = c(n, s, t);
      r && $(r, s, l), this.act(
        l,
        function(_, p, b) {
          return r && h(r, arguments), a.load(
            this,
            s,
            i,
            _,
            p,
            l,
            b,
            r
          );
        }
      );
    },
    list: function(n, i, f) {
      let r = t.debug && v(arguments), s = t.prepareCtx(n), l = c(n, s, t);
      r && $(r, s, l), this.act(
        l,
        function(_, p, b) {
          return r && h(r, arguments), a.list(
            this,
            s,
            i,
            _,
            p,
            l,
            b,
            r
          );
        }
      );
    },
    remove: function(n, i, f) {
      let r = t.debug && v(arguments), s = t.prepareCtx(n), l = c(n, s, t);
      r && $(r, s, l), this.act(
        l,
        function(_, p, b) {
          return r && h(r, arguments), a.remove(
            this,
            s,
            i,
            _,
            p,
            l,
            b,
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
  function v(n) {
    let i = t.debug && {
      msg: n[0],
      meta: n[2],
      start: Date.now()
    };
    return i && w.push(i), i;
  }
  function $(n, i, f) {
    return n.apistart = Date.now(), n.ctx = i, n.apimsg = f, n;
  }
  function h(n, i) {
    return n.apiend = Date.now(), n.err = i[0], n.res = i[1], n.apimeta = i[2], n;
  }
  return {
    name: d.name,
    tag: o.tag,
    exports: {
      makeApiMsg: c,
      msglog: w
    }
  };
}
function y(t, e) {
  return t.entity(e.zone, e.base, e.name).canon$();
}
k.defaults = {
  debug: !1,
  apimsg: {
    aim: "req",
    on: "entity",
    debounce$: !0,
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
    any: function(t, e, m, u, a, w, c, d) {
      if (d && (d.end = Date.now()), u)
        return m(u);
      if (w.load === "entity" && (a == null || a.ok == null))
        return m(null);
      if (a && a.ok && a.item) {
        let o = t.entity({
          zone: e.zone,
          base: e.base,
          name: e.name
        });
        return m(o.make$().data$(a.item));
      } else {
        let o = a && a.err;
        return o = o || new Error(
          `BrowserStore: ${e.cmd} ${y(t, e)}: unknown error`
        ), m(o);
      }
    },
    list: function(t, e, m, u, a, w, c, d) {
      if (d && (d.end = Date.now()), u && m(u), a && a.ok && a.list) {
        let o = t.entity({
          zone: e.zone,
          base: e.base,
          name: e.name
        }), v = a.list.map(($) => o.make$().data$($));
        d && (d.end = Date.now()), m(v);
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
Object.defineProperty(k, "name", { value: "BrowserStore" });
export {
  k as default
};
//# sourceMappingURL=browser-store.es.js.map
