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
    const seneca = makeSeneca()
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

    let msglog = seneca.export('BrowserStore/msglog')
    expect(msglog.length).equal(0)

    fin()
  })

  it('msglog', async function (fin) {
    const seneca = makeSeneca({ BrowserStore: { debug: true } })
    await seneca.ready()

    await seneca.entity('foo').save$({ id: 1, x: 1 })
    await seneca.entity('foo').save$({ id: 2, x: 2 })

    await seneca.entity('browser/-/foo').list$()
    await seneca.entity('browser/-/foo').save$({ id: 3, x: 3 })
    await seneca.entity('browser/-/foo').load$(3)
    await seneca.entity('browser/-/foo').remove$(1)
    await seneca.entity('browser/-/foo').list$()

    let msglog = seneca.export('BrowserStore/msglog')
    // console.log(msglog)
    expect(
      JSON.stringify(
        msglog.map((x) => ({ msg: x.msg, apimsg: x.apimsg, res: x.res })),
      )
        .replace(/\"/g, '')
        .replace(/{msg/g, '\n{msg'),
    ).equals(`[
{msg:{cmd:list,q:{},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,debounce$:true,q:{},ent:{entity$:browser/-/foo},cmd:list,store:true},res:{ok:true,list:[{entity$:{name:foo},id:1,x:1},{entity$:{name:foo},id:2,x:2}]}},
{msg:{cmd:save,q:{id:3,x:3},sys:entity,ent:{entity$:browser/-/foo,id:3,x:3},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,debounce$:true,q:{id:3,x:3},ent:{entity$:browser/-/foo,id:3,x:3},cmd:save,store:true}},
{msg:{cmd:load,q:{id:3},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,debounce$:true,q:{id:3},ent:{entity$:browser/-/foo},cmd:load,store:true},res:{ok:true,ent:{entity$:{name:foo},id:3,x:3}}},
{msg:{cmd:remove,q:{id:1},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,debounce$:true,q:{id:1},ent:{entity$:browser/-/foo},cmd:remove,store:true},res:{ok:true}},
{msg:{cmd:list,q:{},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,debounce$:true,q:{},ent:{entity$:browser/-/foo},cmd:list,store:true},res:{ok:true,list:[{entity$:{name:foo},id:2,x:2},{entity$:{name:foo},id:3,x:3}]}}]`)

    fin()
  })
})

function makeSeneca(options) {
  options = options || {}
  const deep = Seneca.util.deep
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
    .use(
      BrowserStore,
      deep(
        {
          map: {
            'browser/-/-': '*',
          },
          apimsg: {
            canon: (msg) =>
              (msg.ent || msg.qent).entity$.replace('browser/', '-/'),
          },
        },
        options.BrowserStore,
      ),
    )

  return seneca
}

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
