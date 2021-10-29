const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');



module.exports = {
  requireEmail: check('email')
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
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.password.password) {
        throw new Error('Passwords must match');
      }
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email: email });
      if (!user) {
        throw new Error('Email not found!')
      }
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      // get email from db
      const user = await usersRepo.getOneBy({ email: req.body.email })
      // we have to check email or else we get error
      if (!user) {
        throw new Error('Invlaid Password')
      }

      // compare email provided and password from db
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );
      // if validPassword is false throw error
      if (!validPassword) {
        throw new Error('Invalid Password')
      }
    })
}




