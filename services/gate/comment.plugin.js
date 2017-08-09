function api(options) {

  // SAVE COMMENT
  this.add('gate:comment,cmd:save', function (msg, respond) {

    let data = {
      email: msg.args.body.email,
      comment: msg.args.body.comment,
      token: msg.args.body.token
    }

    this.act('role:comment,cmd:save', data, respond)
  })

}

module.exports = api
