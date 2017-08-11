function api(options) {

  // SAVE COMMENT
  this.add('gate:comment,cmd:save', function (msg, respond) {

    let data = {
      email: msg.args.body.email,
      comment: msg.args.body.comment,
      token: msg.args.body.token,
      parent: msg.args.body.parent
    }

    this.act('role:comment,cmd:save', data, respond)
  })

  // LIST COMMENTS
  this.add('gate:comment,cmd:list', function (msg, respond) {

    let data = {
      token: msg.args.body.token
    }

    this.act('role:comment,cmd:list', data, respond)
  })

  // APPROVE COMMENT
  this.add('gate:comment,cmd:approve', function (msg, respond) {

    let data = {
      id: msg.args.body.id,
      token: msg.args.body.token
    }

    this.act('role:comment,cmd:approve', data, respond)
  })

}

module.exports = api
