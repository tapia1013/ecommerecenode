// sub router for const app = express()
const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();


router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }));
});



// we put the middleware inbetween '/',HERE,()=>{}
router.post('/signup', [
  // FIRST WE SANITZE THEN WE VALIDATE
  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email in use');
      }
    }),
  check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.password.password) {
        throw new Error('Passwords must match');
      }
    })
], async (req, res) => {
  // console.log(req.body);

  // expressValidator errors
  const errors = validationResult(req)
  console.log(errors);

  const { email, password, passwordConfirmation } = req.body;

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