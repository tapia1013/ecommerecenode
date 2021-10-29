// sub router for const app = express()
const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser
} = require('./validators');

const router = express.Router();


router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }));
});



// we put the middleware inbetween '/',HERE,()=>{}
router.post(
  '/signup',
  [
    // FIRST WE SANITZE THEN WE VALIDATE
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
  ],
  async (req, res) => {
    // expressValidator errors
    const errors = validationResult(req)
    // console.log(errors);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }


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
  // pass empty {} or else it will give undefined error
  res.send(signinTemplate({}));
});

// handle singin
router.post(
  '/signin',
  [
    requireEmailExists,
    requireValidPasswordForUser
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors }))
    }

    const { email } = req.body;

    // check to see if existing user in DB
    const user = await usersRepo.getOneBy({ email });

    // sign in if true
    req.session.userId = user.id;

    res.send('You are signed in!!!');
  });




module.exports = router;