// sub router for const app = express()
const express = require('express');
const { check } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();


router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }));
});



// we put the middleware inbetween '/',HERE,()=>{}
router.post('/signup', [
  check('email').isEmail(),
  check('password').isLength(),
  check('passwordConfirmation')
], async (req, res) => {
  // console.log(req.body);

  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send('Email in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must match');
  }

  // Create a user in our user repo to represent this person
  const user = await usersRepo.create({ email: email, password: password });

  // Store the ID of that user inside the user coookie
  // req.session === {} // Added by cookie session!
  req.session.userId = user.id;


  res.send('Account created!!!');
});



// SIGNOUT
router.get('/signout', (req, res) => {
  // tell browser to forget cookie info
  req.session = null;
  res.send('You are logged out!')
});


// SIGNIN
router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

// handle singin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // check to see if existing user in DB
  const user = await usersRepo.getOneBy({ email: email });

  // if user not found
  if (!user) {
    return res.send('Email not found!');
  }

  // hashed
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  )

  // if we did find user check if passwords match
  if (!validPassword) {
    return res.send('Invalid Password');
  }

  // sign in if true
  req.session.userId = user.id;

  res.send('You are signed in!!!');
});




module.exports = router;