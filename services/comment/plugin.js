module.exports = function (options) {
  this.add('role:comment,cmd:save', function (args, done) {

    // VERIFY USER AND SAVE COMMENT
    this.act('role:user,cmd:auth', {token: args.token}, (err, data) => {
      if (err) return done(err)
      if (!data.ok) return done(data)

      let comment = this.make$('comment', {
        email: args.email,
        comment: args.comment,
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
        /**
         * LIST:
         *  - approved comments
         *  - non approved comments if admin
         *  - non approved comments of own user
         */
      this.act('role:user,cmd:auth', {token: token}, (err, data) => {
        if (err) return done(err)
        if (!data.ok) return done(data)

        // authentication succeeds
        let isAdmin = data.user.userRole === 'Admin'
        let author = data.user.email

        //TODO
        // the plugin 'seneca-store-query' enables to
        // do 'or' queries with mysql and postgres...
        let comment = this.make$('comment')
          .list$((err, data) => {

            if (err) return done(err, data)

            let res = []

            for (let i = 0; i < data.length; i++) {
              let c_ent = data[i]

              if (!isAdmin) {
                if (c_ent.email === author || c_ent.approved) {
                  res.push(c_ent)
                }
              } else {
                res.push(c_ent)
              }
            }

            console.log(res)
            done({ok: true, data: res})
          })
      })
    }
  })

  this.add('role:comment,cmd:approve', function (args, done) {

    let token = args.token
    let comment_id = args.id

    this.act('role:user,cmd:auth', {token: token}, (err, data) => {
      if (err) return done(err)
      if (!data.ok) return done(data)

      // authentication succeeds
      if (data.user.userRole === 'Admin') {

        let comment = this.make$('comment')

        comment.id = comment_id
        comment.approved = true

        comment.save$((err, ent) => {

          if (err) return done(err, ent)
          done({ok: true, data: ent})
        })
      }
    })
  })
}