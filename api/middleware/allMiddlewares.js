const User = require('../auth/auth-model');
const { JWT_SECRET } = require('../../secrets/index')
const jwt = require('jsonwebtoken')


 function restricted(req, res, next) {
    const token = req.headers.authorization 
    if(!token) {
      return next({status:401, message: "Token required"})
    } 
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next({message: 'Token invalid' })
      } else {
        req.decodedToken = decodedToken
        next()
      }
    })
}

function bodyPresent(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'username and password required' });
  } else {
    next();
  }
}

async function usernameAvailable(req, res, next) {
  try{
    const users = await User.findBy({username: req.body.username});
    if(!users.length) {
      next()
    } else {
      next({"message": "username taken"})
    }
  } catch (err) {
    next(err)
  }
}

async function usernameExists(req, res, next) {
  try{
    const users = await User.findBy({username: req.body.username});
    if(users.length) {
      req.user = users[0]
      next()
    } else {
      next({"message": "invalid credentials"})
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  restricted,
  bodyPresent,
  usernameAvailable,
  usernameExists
};




/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */