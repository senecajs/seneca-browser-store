# Changes

## 0.3.0 2026-11-20

First entry of this change log. Earlier versions are on npm and in the
git history.

* Seneca 4: the peer dependencies are `seneca` `^4.0.0` and
  `@seneca/entity` `^29.0.0` (was `seneca-entity` `>=28`). Seneca 3 is
  no longer supported; Seneca 3 users stay on `@seneca/browser-store@0.2`.
* Node.js 24 or later (`engines.node` `>=24`).
* Option defaults are built with the `valid` builders that Seneca
  passes, because Seneca 4 closes plain-object defaults. `map` is now a
  declared option, and `apimsg` and `handleResponse` stay open, so that
  extra message properties and per-command handlers (`save`, `load`,
  `list`, `remove`) are accepted as before. `BrowserStore.defaults` is
  therefore a function of `{ valid }`, no longer an object.
* `package.json` `exports` names the types.
* Tests now run (`npm test` was `echo test`): `@hapi/lab` 26 with
  `@seneca/entity` 29. The test backend answers the message format the
  plugin has sent since 0.0.6 (`aim:req,on:entity,<cmd>:entity`, reply
  `{ ok, item }` or `{ ok, list }`).
* `dist/` rebuilt.
