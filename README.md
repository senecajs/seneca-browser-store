![Seneca Browser-Store](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Browser Store_ is a plugin for [Seneca](http://senecajs.org)

Converts Seneca entity messages to backend API requests.

See [@seneca/entity](https://github.com/senecajs/seneca-entity) and the [Seneca Data Entities Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html) for more details on the Seneca entity API.

<!-- [![npm version](https://img.shields.io/npm/v/@seneca/tangocard-provider.svg)](https://npmjs.com/package/@seneca/tangocard-provider)
[![build](https://github.com/senecajs/seneca-tangocard-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-tangocard-provider/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-tangocard-provider/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-tangocard-provider?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-tangocard-provider/badge.svg)](https://snyk.io/test/github/senecajs/seneca-tangocard-provider)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19462/branches/505954/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19462&bid=505954)
[![Maintainability](https://api.codeclimate.com/v1/badges/f76e83896b731bb5d609/maintainability)](https://codeclimate.com/github/senecajs/seneca-tangocard-provider/maintainability) -->

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

## Quick Example

```js
const Seneca = require('seneca')

const seneca = Seneca()
  .use('@seneca/entity')
  .use('@seneca/browser-store', {
    // entities in the zone "browser" are sent to the backend
    map: { 'browser/-/-': '*' },
  })

// Sends aim:req,on:entity,list:entity with q, ent, name, base and zone,
// and expects a reply { ok: true, list: [...] }.
// save, load and remove expect { ok: true, item: {...} }.
seneca.entity('browser/-/foo').list$().then((list) => console.log(list))
```

## Description


## Code examples


## Install

Requires Seneca 4 (`seneca` `^4.0.0`) and `@seneca/entity` `^29.0.0`.

```sh
npm install seneca@^4 @seneca/entity @seneca/browser-store
```

## Quick Example


## Usage

## Contributing

## Test


## License
Copyright (c) 2023, Richard Rodger and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE
