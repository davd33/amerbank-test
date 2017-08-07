function api(options) {

  this.add('role:user,cmd:add', function (msg, respond) {

    let data = {
      email: msg.args.body.email,
      price: msg.args.body.price,
      comment: msg.args.body.comment
    }

    this.act(`registration:store,cmd:add`, {data: data}, respond)
  })

  this.add('role:user,cmd:delete', function (msg, respond) {

    let data = {
      userId: msg.args.query.userId,
      token: msg.args.query.userToken
    }

    this.act(`registration:store,cmd:delete`, {data: data}, respond)
  })

  this.add('role:user,cmd:list', function (msg, respond) {
    this.act(`registration:store,cmd:list`, respond)
  })

}

module.exports = api
