function S(t) {
  let e = this, o = e.export("entity/init"), u = t.handleResponse, i = ["save", "load", "list", "remove"].reduce(
    (n, r) => (n[r] = u[r] || u.any, n),
    {}
  );
  const b = [];
  function m(n, r, c) {
    let a = {}, s = c.apimsg;
    for (let l in s) {
      let f = s[l];
      typeof f == "function" ? a[l] = f(n, r, c) : a[l] = JSON.parse(JSON.stringify(f));
    }
    return a;
  }
  let d = {
    name: "BrowserStore",
    save: function(n, r, c) {
      let a = t.debug && v(arguments), s = t.prepareCtx(n), l = m(n, s, t);
      a && w(a, s, l), this.act(
        l,
        function(g, _, p) {
          return a && h(a, arguments), i.save(this, s, r, g, _, p, a);
        }
      );
    },
    load: function(n, r, c) {
      let a = t.debug && v(arguments), s = t.prepareCtx(n), l = m(n, s, t);
      a && w(a, s, l), this.act(
        l,
        function(g, _, p) {
          return a && h(a, arguments), i.load(this, s, r, g, _, p, a);
        }
      );
    },
    list: function(n, r, c) {
      let a = t.debug && v(arguments), s = t.prepareCtx(n), l = m(n, s, t);
      a && w(a, s, l), this.act(
        l,
        function(g, _, p) {
          return a && h(a, arguments), i.list(this, s, r, g, _, p, a);
        }
      );
    },
    remove: function(n, r, c) {
      let a = t.debug && v(arguments), s = t.prepareCtx(n), l = m(n, s, t);
      a && w(a, s, l), this.act(
        l,
        function(g, _, p) {
          return a && h(a, arguments), i.remove(
            this,
            s,
            r,
            g,
            _,
            p,
            a
          );
        }
      );
    },
    close: function(n, r) {
      r();
    },
    native: function(n, r) {
      r();
    }
  }, $ = o(e, t, d);
  function v(n) {
    let r = t.debug && {
      msg: n[0],
      meta: n[2],
      start: Date.now()
    };
    return r && b.push(r), r;
  }
  function w(n, r, c) {
    return n.apistart = Date.now(), n.ctx = r, n.apimsg = c, n;
  }
  function h(n, r) {
    return n.apiend = Date.now(), n.err = r[0], n.res = r[1], n.apimeta = r[2], n;
  }
  return {
    name: d.name,
    tag: $.tag,
    exports: {
      makeApiMsg: m,
      msglog: b
    }
  };
}
function y(t, e) {
  return t.entity(e.zone, e.base, e.name).canon$();
}
S.defaults = {
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
    let o = t.q;
    e.store = o.store$ !== !1, delete o.store$, e.cmd = t.cmd;
    let u = t.ent || t.qent;
    if (u) {
      if (u.canon$)
        Object.assign(e, u.canon$({ object: !0 }));
      else if (u.entity$) {
        let i = u.entity$.split("/");
        Object.assign(e, {
          zone: i[0] === "-" ? null : i[0],
          base: i[1] === "-" ? null : i[1],
          name: i[2] === "-" ? null : i[2]
        });
      }
    }
    return e;
  },
  handleResponse: {
    any: function(t, e, o, u, i, b, m) {
      if (m && (m.end = Date.now()), u)
        return o(u);
      if (i && i.ok)
        return o(i.ent);
      {
        let d = i && i.err;
        return d = d || new Error(
          `BrowserStore: ${e.cmd} ${y(t, e)}: unknown error`
        ), o(d);
      }
    },
    list: function(t, e, o, u, i, b, m) {
      if (m && (m.end = Date.now()), u && o(u), i && i.ok && i.list) {
        let d = t.entity({
          zone: e.zone,
          base: e.base,
          name: e.name
        }), $ = i.list.map((v) => d.make$().data$(v));
        m && (m.end = Date.now()), o($);
      } else {
        let d = i && i.err;
        d = d || new Error(
          `BrowserStore: ${e.cmd} ${y(
            t,
            e
          )}: unknown list error`
        ), o(d);
      }
    }
  }
};
Object.defineProperty(S, "name", { value: "BrowserStore" });
export {
  S as default
};
//# sourceMappingURL=browser-store.es.js.map
