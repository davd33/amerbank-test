module.exports = [
  {
    prefix: '/user',
    pin: 'gate:user,cmd:*',
    map: {
      register: {
        POST: true,
        json: true
      },
      login: {
        POST: true,
        json: true
      },
      auth: {
        POST: true,
        json: true
      }
    }
  }
]