function q(e) {
  let t = this, o = t.export("entity/init"), l = e.handleResponse, s = ["save", "load", "list", "remove"].reduce(
    (n, a) => (n[a] = l[a] || l.any, n),
    {}
  );
  const w = [];
  function m(n, a, f) {
    let r = {}, i = f.apimsg;
    for (let u in i) {
      let d = i[u];
      typeof d == "function" ? r[u] = d(n, a, f) : r[u] = JSON.parse(JSON.stringify(d));
    }
    return r;
  }
  let c = {
    name: "BrowserStore",
    save: function(n, a, f) {
      let r = e.debug && b(arguments), i = e.prepareCtx(n), u = m(n, i, e);
      r && h(r, i, u), this.act(
        u,
        function(g, p, _) {
          return r && $(r, arguments), s.save(this, i, a, g, p, _, r);
        }
      );
    },
    load: function(n, a, f) {
      let r = e.debug && b(arguments), i = e.prepareCtx(n), u = m(n, i, e);
      r && h(r, i, u), this.act(
        u,
        function(g, p, _) {
          return r && $(r, arguments), s.load(this, i, a, g, p, _, r);
        }
      );
    },
    list: function(n, a, f) {
      let r = e.debug && b(arguments), i = e.prepareCtx(n), u = m(n, i, e);
      r && h(r, i, u), this.act(
        u,
        function(g, p, _) {
          return r && $(r, arguments), s.list(this, i, a, g, p, _, r);
        }
      );
    },
    remove: function(n, a, f) {
      let r = e.debug && b(arguments), i = e.prepareCtx(n), u = m(n, i, e);
      r && h(r, i, u), this.act(
        u,
        function(g, p, _) {
          return r && $(r, arguments), s.remove(
            this,
            i,
            a,
            g,
            p,
            _,
            r
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
  }, v = o(t, e, c);
  function b(n) {
    let a = e.debug && {
      msg: n[0],
      meta: n[2],
      start: Date.now()
    };
    return a && w.push(a), a;
  }
  function h(n, a, f) {
    return n.apistart = Date.now(), n.ctx = a, n.apimsg = f, n;
  }
  function $(n, a) {
    return n.apiend = Date.now(), n.err = a[0], n.res = a[1], n.apimeta = a[2], n;
  }
  return {
    name: c.name,
    tag: v.tag,
    exports: {
      makeApiMsg: m,
      msglog: w
    }
  };
}
function S(e, t) {
  return e.entity(t.zone, t.base, t.name).canon$();
}
q.defaults = {
  debug: !1,
  apimsg: {
    aim: "req",
    on: "entity",
    debounce$: !0,
    q: (e, t) => e.q,
    ent: (e, t) => e.ent,
    cmd: (e, t) => t.cmd,
    store: (e, t) => t.store,
    name: (e, t) => t.name,
    base: (e, t) => t.base,
    zone: (e, t) => t.zone
  },
  prepareCtx: (e, t) => {
    t = t || {};
    let o = e.q;
    t.store = o.store$ !== !1, delete o.store$, t.cmd = e.cmd;
    let l = e.ent || e.qent;
    if (l) {
      if (l.canon$)
        Object.assign(t, l.canon$({ object: !0 }));
      else if (l.entity$) {
        let s = l.entity$.split("/");
        Object.assign(t, {
          zone: s[0] === "-" ? null : s[0],
          base: s[1] === "-" ? null : s[1],
          name: s[2] === "-" ? null : s[2]
        });
      }
    }
    return t;
  },
  handleResponse: {
    any: function(e, t, o, l, s, w, m) {
      if (m && (m.end = Date.now()), l)
        return o(l);
      if (s && s.ok)
        return o(s.ent);
      {
        let c = s && s.err;
        return c = c || new Error(
          `BrowserStore: ${t.cmd} ${S(e, t)}: unknown error`
        ), o(c);
      }
    },
    list: function(e, t, o, l, s, w, m) {
      if (m && (m.end = Date.now()), l && o(l), s && s.ok && s.list) {
        let c = e.entity({ zone: t.zone, base: t.base, name: t.name }), v = s.list.map((b) => c.make$().data$(b));
        m && (m.end = Date.now()), o(v);
      } else {
        let c = s && s.err;
        c = c || new Error(
          `BrowserStore: ${t.cmd} ${S(e, t)}: unknown list error`
        ), o(c);
      }
    }
  }
};
Object.defineProperty(q, "name", { value: "BrowserStore" });
export {
  q as default
};
//# sourceMappingURL=browser-store.es.js.map
