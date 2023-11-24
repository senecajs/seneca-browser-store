const Seneca = require('seneca')
const BrowserStore = require('..')
console.log(BrowserStore)

run()

async function run() {
  const seneca = Seneca()
    .test()
    .use('promisify')
    .use('entity')
    .use(function entityServer() {
      let seneca = this

      seneca
        .fix('req:web,on:entity')
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
        canon: (msg) => (msg.ent || msg.qent).entity$.replace('browser/', '-/'),
      },
    })

  await seneca.ready()

  await seneca.entity('foo').save$({ id: 1, x: 1 })
  await seneca.entity('foo').save$({ id: 2, x: 2 })

  let out = await seneca.entity('browser/-/foo').list$()
  console.log('list', out)

  let foo3 = await seneca.entity('browser/-/foo').save$({ id: 3, x: 3 })
  console.log('foo3', foo3)

  out = await seneca.entity('browser/-/foo').load$(3)
  console.log('load', out)

  out = await seneca.entity('browser/-/foo').remove$(1)
  console.log('remove', out)

  out = await seneca.entity('browser/-/foo').list$()
  console.log('list', out)
}
