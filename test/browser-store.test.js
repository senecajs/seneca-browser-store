/*
  MIT License,
  Copyright (c) 2013, Richard Rodger and other contributors.
*/

'use strict'

const Seneca = require('seneca')
const BrowserStore = require('..')

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const { expect } = Code
const lab = (exports.lab = Lab.script())
const { describe, it } = lab

describe('browser-store tests', function () {
  it('happy', async function () {
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
    expect(out).includes({ id: 1, x: 1 })

    out = await seneca.entity('browser/-/foo').list$()
    expect(out.length).equals(2)
    expect(out[0]).includes({ id: 2, x: 2 })
    expect(out[1]).includes({ id: 3, x: 3 })

    let msglog = seneca.export('BrowserStore/msglog')
    expect(msglog.length).equal(0)
  })

  it('handleResponse per command', async function () {
    // handleResponse takes handlers for save, load, list and remove as
    // well as the defaults any and list.
    const seneca = makeSeneca({
      BrowserStore: {
        handleResponse: {
          remove: function (seneca, ctx, reply, err) {
            return err ? reply(err) : reply(null)
          },
        },
      },
    })
    await seneca.ready()

    await seneca.entity('foo').save$({ id: 1, x: 1 })

    let out = await seneca.entity('browser/-/foo').remove$(1)
    expect(out).equals(null)

    out = await seneca.entity('browser/-/foo').list$()
    expect(out.length).equals(0)
  })

  it('msglog', async function () {
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
    expect(
      JSON.stringify(
        msglog.map((x) => ({ msg: x.msg, apimsg: x.apimsg, res: x.res })),
      )
        .replace(/\"/g, '')
        .replace(/{msg/g, '\n{msg'),
    ).equals(`[
{msg:{cmd:list,q:{},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,q:{},ent:{entity$:browser/-/foo},list:entity,store:true,name:foo,zone:browser},res:{ok:true,list:[{entity$:{name:foo},id:1,x:1},{entity$:{name:foo},id:2,x:2}]}},
{msg:{cmd:save,q:{id:3,x:3},sys:entity,ent:{entity$:browser/-/foo,id:3,x:3},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,q:{id:3,x:3},ent:{entity$:browser/-/foo,id:3,x:3},save:entity,store:true,name:foo,zone:browser},res:{ok:true,item:{entity$:{name:foo},id:3,x:3}}},
{msg:{cmd:load,q:{id:3},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,q:{id:3},ent:{entity$:browser/-/foo},load:entity,store:true,name:foo,zone:browser},res:{ok:true,item:{entity$:{name:foo},id:3,x:3}}},
{msg:{cmd:remove,q:{id:1},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,q:{id:1},ent:{entity$:browser/-/foo},remove:entity,store:true,name:foo,zone:browser},res:{ok:true,item:{entity$:{name:foo},id:1,x:1}}},
{msg:{cmd:list,q:{},qent:{entity$:browser/-/foo},sys:entity,ent:{entity$:browser/-/foo},name:foo,zone:browser},apimsg:{canon:-/-/foo,aim:req,on:entity,q:{},ent:{entity$:browser/-/foo},list:entity,store:true,name:foo,zone:browser},res:{ok:true,list:[{entity$:{name:foo},id:2,x:2},{entity$:{name:foo},id:3,x:3}]}}]`)
  })
})

function makeSeneca(options) {
  options = options || {}
  const deep = Seneca.util.deep
  const seneca = Seneca({ legacy: false })
    .test()
    .use('@seneca/entity')
    .use(function entityServer() {
      // A backend that answers the API messages of BrowserStore:
      // aim:req,on:entity,<cmd>:entity, with { ok, item } or { ok, list }.
      let seneca = this

      seneca
        .fix('aim:req,on:entity')
        .message('save:entity', async function save(msg) {
          return {
            ok: true,
            item: (await this.entity(msg.canon).save$(msg.ent)).data$(),
          }
        })
        .message('load:entity', async function load(msg) {
          return {
            ok: true,
            item: (await this.entity(msg.canon).load$(msg.q))?.data$(),
          }
        })
        .message('list:entity', async function list(msg) {
          return {
            ok: true,
            list: (await this.entity(msg.canon).list$(msg.q)).map((n) =>
              n.data$(),
            ),
          }
        })
        .message('remove:entity', async function remove(msg) {
          return {
            ok: true,
            item: (
              await this.entity(msg.canon).remove$({ ...msg.q, load$: true })
            )?.data$(),
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
