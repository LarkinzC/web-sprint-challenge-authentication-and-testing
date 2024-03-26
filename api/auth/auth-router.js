const router = require('express').Router();
const User = require('../auth/auth-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { bodyPresent, usernameAvailable, usernameExists } = require('../middleware/allMiddlewares');
const { JWT_SECRET } = require('../../secrets/index')



router.post('/register', bodyPresent, usernameAvailable, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)

  User.add({username, password: hash})
    .then(savedUser => {
      res.status(201).json(savedUser)
    }).catch(next)
  /* 
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', bodyPresent, usernameExists, (req, res, next) => {

  if(bcrypt.compareSync(req.body.password, req.user.password)) {
    console.log(req.user)
    const token = buildToken(req.user)
    res.json({
      message: `welcome, ${req.user.username}`,
      token,
    })
  } else {
    next({status: 401, message: 'invalid credentials'})
  }
  
  
});


function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}


module.exports = router;
