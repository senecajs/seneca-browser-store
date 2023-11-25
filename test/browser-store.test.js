/*
  MIT License,
  Copyright (c) 2013, Richard Rodger and other contributors.
*/

'use strict'

const Util = require('util')

const Assert = require('assert')
const Seneca = require('seneca')
const Shared = require('seneca-store-test')
const MakePluginValidator = require('seneca-plugin-validator')
const BrowserStore = require('..')

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const { expect } = Code
const lab = (exports.lab = Lab.script())
const { describe, before, after } = lab
const it = make_it(lab)

describe('browser-store tests', function () {
  it('happy', async function (fin) {
    const Seneca = require('seneca')

    const seneca = Seneca()
      .test()
      .use('promisify')
      .use('entity')
      .use(function entityServer() {
        let seneca = this

        seneca
          .fix('aim:req,on:entity')
          .message('cmd:save', async function save(msg) {
            return {
              ok: true,
              ent: (await this.entity(msg.canon).save$(msg.ent)).data$(),
            }
          })
          .message('cmd:load', async function save(msg) {
            return {
              ok: true,
              ent: (await this.entity(msg.canon).load$(msg.q))?.data$(),
            }
          })
          .message('cmd:list', async function save(msg) {
            return {
              ok: true,
              list: (await this.entity(msg.canon).list$(msg.q)).map((n) =>
                n.data$(),
              ),
            }
          })
          .message('cmd:remove', async function remove(msg) {
            return {
              ok: true,
              ent: (await this.entity(msg.canon).remove$(msg.q))?.data$(),
            }
          })
      })
      .use(BrowserStore, {
        map: {
          'browser/-/-': '*',
        },
        apimsg: {
          canon: (msg) =>
            (msg.ent || msg.qent).entity$.replace('browser/', '-/'),
        },
      })

    await seneca.ready()

    await seneca.entity('foo').save$({ id: 1, x: 1 })
    await seneca.entity('foo').save$({ id: 2, x: 2 })

    let out = await seneca.entity('browser/-/foo').list$()
    expect(out.length).equals(2)
    expect(out[0]).includes({ id: 1, x: 1 })
    expect(out[1]).includes({ id: 2, x: 2 })

    let foo3 = await seneca.entity('browser/-/foo').save$({ id: 3, x: 3 })
    expect(foo3).includes({ id: 3, x: 3 })

    out = await seneca.entity('browser/-/foo').load$(3)
    expect(out).includes({ id: 3, x: 3 })

    out = await seneca.entity('browser/-/foo').remove$(1)
    expect(out).equals(null)

    out = await seneca.entity('browser/-/foo').list$()
    expect(out.length).equals(2)
    expect(out[0]).includes({ id: 2, x: 2 })
    expect(out[1]).includes({ id: 3, x: 3 })

    fin()
  })
})

function make_it(lab) {
  return function it(name, opts, func) {
    if ('function' === typeof opts) {
      func = opts
      opts = {}
    }

    lab.it(
      name,
      opts,
      Util.promisify(function (x, fin) {
        func(fin)
      }),
    )
  }
}
