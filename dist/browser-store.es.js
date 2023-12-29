function $(t) {
  let r = this, o = r.export("entity/init"), m = t.handleResponse, l = ["save", "load", "list", "remove"].reduce(
    (n, a) => (n[a] = m[a] || m.any, n),
    {}
  );
  const w = [];
  function u(n, a, _) {
    let e = {}, i = _.apimsg;
    for (let s in i) {
      let p = i[s];
      typeof p == "function" ? e[s] = p(n, a, _) : e[s] = JSON.parse(JSON.stringify(p));
    }
    return e;
  }
  let c = {
    name: "BrowserStore",
    save: function(n, a, _) {
      let e = t.debug && h(arguments), i = t.prepareCtx(n), s = u(n, i, t);
      e && (e.ctx = i) && (e.apimsg = s), this.act(
        s,
        function(d, f, g) {
          return e && (e.apiend = Date.now()) && (e.err = d) && (e.res = f) && (e.apimeta = g), l.save(this, i, a, d, f, g, e);
        }
      );
    },
    load: function(n, a, _) {
      let e = t.debug && h(arguments), i = t.prepareCtx(n), s = u(n, i, t);
      e && (e.ctx = i) && (e.apimsg = s), this.act(
        s,
        function(d, f, g) {
          return e && x(e, arguments), l.load(this, i, a, d, f, g, e);
        }
      );
    },
    list: function(n, a, _) {
      let e = t.debug && h(arguments), i = t.prepareCtx(n), s = u(n, i, t);
      e && (e.ctx = i) && (e.apimsg = s), this.act(
        s,
        function(d, f, g) {
          return e && x(e, arguments), l.list(this, i, a, d, f, g, e);
        }
      );
    },
    remove: function(n, a, _) {
      let e = t.debug && h(arguments), i = t.prepareCtx(n), s = u(n, i, t);
      e && (e.ctx = i) && (e.apimsg = s), this.act(
        s,
        function(d, f, g) {
          return e && x(e, arguments), l.remove(
            this,
            i,
            a,
            d,
            f,
            g,
            e
          );
        }
      );
    },
    close: function(n, a) {
      a();
    },
    native: function(n, a) {
      a();
    }
  }, v = o(r, t, c);
  function h(n) {
    let a = t.debug && {
      msg: n[0],
      meta: n[2],
      start: Date.now()
    };
    return a && w.push(a), a;
  }
  function x(n, a) {
    return n.apiend = Date.now(), n.err = a[0], n.res = a[1], n.apimeta = a[2], n;
  }
  return {
    name: c.name,
    tag: v.tag,
    exports: {
      makeApiMsg: u,
      msglog: w
    }
  };
}
$.defaults = {
  debug: !1,
  apimsg: {
    aim: "req",
    on: "entity",
    debounce$: !0,
    q: (t, r) => t.q,
    ent: (t, r) => t.ent,
    cmd: (t, r) => r.cmd,
    canon: (t, r) => (t.ent || t.qent).entity$,
    store: (t, r) => r.store
  },
  prepareCtx: (t, r) => {
    r = r || {};
    let o = t.q;
    return r.store = o.store$ !== !1, delete o.store$, r.cmd = t.cmd, r.canon = (t.ent || t.qent).entity$, r;
  },
  handleResponse: {
    any: function(t, r, o, m, l, w, u) {
      if (console.log("BS RES", m, l), u && (u.end = Date.now()), m && o(m), l)
        if (l.ok)
          o(l.ent);
        else {
          let c = l.err;
          c = c || new Error(`BrowserStore: ${r.cmd} ${r.canon}: unknown error`), o(c);
        }
    },
    list: function(t, r, o, m, l, w, u) {
      if (u && (u.end = Date.now()), m && o(m), l && l.ok && l.list) {
        let c = l.list.map(
          (v) => t.entity(r.canon).data$(v)
        );
        u && (u.end = Date.now()), o(c);
      } else
        o(
          l && l.err || new Error(
            `BrowserStore: ${r.cmd} ${r.canon}: unknown list error`
          )
        );
    }
  }
};
Object.defineProperty($, "name", { value: "BrowserStore" });
export {
  $ as default
};
//# sourceMappingURL=browser-store.es.js.map
