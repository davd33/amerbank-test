module.exports = function (options) {
  this.add('role:comment,cmd:save', function (args, done) {

    // must be user to save comment
    this.act('role:user,cmd:auth', {token: encodeURIComponent(args.token)}, (err, data) => {
      if (err) return done(err)
      if (!data.ok) return done(data)

      let comment = this.make$('comment', {
        email: args.email,
        comment: encodeURIComponent(args.comment),
      }).save$((err, ent) => {

        if (err) return done(err, ent)
        done(ent)
      })
    })
  })

  this.add('role:comment,cmd:list', function (args, done) {

    let comment = this.make$('comment').list$((err, ent) => {
      if (err) return done(err, ent)
      done({ok: true, data: ent})
    })
  })
}