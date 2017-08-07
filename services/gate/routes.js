module.exports = [
  {
    prefix: '/user',
    pin: 'role:user,cmd:*',
    map: {
      add: {
        POST: true,
        json: true
      },
      delete: {
        GET: true,
        json: true
      },
      list: {
        GET: true,
        json: true
      }
    }
  }
]