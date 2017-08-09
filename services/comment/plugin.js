module.exports = function (options) {
  this.add('role:comment,cmd:save', function (args, done) {

    // VERIFY USER AND SAVE COMMENT
    this.act('role:user,cmd:auth', {token: encodeURIComponent(args.token)}, (err, data) => {
      if (err) return done(err)
      if (!data.ok) return done(data)

      let comment = this.make$('comment', {
        email: args.email,
        comment: encodeURIComponent(args.comment),
        approved: false
      }).save$((err, ent) => {

        if (err) return done(err, ent)
        done({ok: true, data: ent})
      })
    })
  })

  this.add('role:comment,cmd:list', function (args, done) {

    let token = args.token;

    if (!token) {
      // LIST APPROVED COMMENTS
      let comment = this.make$('comment')
        .list$({approved: true}, (err, ent) => {

          if (err) return done(err, ent)
          done({ok: true, data: ent})
        })
    } else {
      // VERIFY USER AUTH AND ROLE THEN LIST ALL COMMENTS
      this.act('role:user,cmd:auth', {token: encodeURIComponent(token)}, (err, data) => {
        if (err) return done(err)
        if (!data.ok) return done(data)

        // authentication succeeds
        let isAdmin = data.user.userRole === 'Admin'

        let comment = this.make$('comment')
          .list$(isAdmin ? {} : {approved: true}, (err, ent) => {

            if (err) return done(err, ent)
            done({ok: true, data: ent})
          })
      })
    }
  })

  this.add('role:comment,cmd:approve', function (args, done) {

    let comment = this.make$('comment')
      .list$({id: args.id, limit$: 1}, (err, ent) => {

        if (err) return done(err, ent)
        else {
          ent.approved = true;
          ent.save$((err, ent) => {

            if (err) return done(err, ent)
            done({ok: true, data: ent})
          })
        }
      })
  })
}