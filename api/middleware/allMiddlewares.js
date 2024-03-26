const User = require('../auth/auth-model')

const restricted = (req, res, next) => {
  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};

const bodyPresent = (req, res, next) => {
  const {username, password} = req.body 
  if (!username.trim() || !password.trim()) {
      res.status(404).json(
          {message: 'username taken'}
      )
  } 
  next()
}

const usernameAvailable = async (req, res, next) => {
  const user = await User.findByUsername(req.body.username)
  if(!user) {
      next()
  } else {
      next({status: 404, message: 'username taken'})
  }
}

module.exports = {
  restricted,
  bodyPresent,
  usernameAvailable
}