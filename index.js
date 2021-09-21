const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const users = require('./repositories/users');

const app = express();

// bodyparses everywhere in the app so we wont have to keep writing it
app.use(bodyParser.urlencoded({ extended: true }));
// cookie session is a middleware so we have to app.use
app.use(cookieSession({
  keys: ['ilysmb09131013']
}))


app.get('/signup', (req, res) => {
  res.send(`
    <div>
    Your id is: ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});



// we put the middleware inbetween '/',HERE,()=>{}
app.post('/signup', async (req, res) => {
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
app.get('/signout', (req, res) => {
  // tell browser to forget cookie info
  req.session = null;
  res.send('You are logged out!')
});


// SIGNIN
app.get('/signin', (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <button>Sign In</button>
    </form>
  </div>
  `);
});
// handle singin
app.post('/signin', async (req, res) => {
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


app.listen(3000, () => {
  console.log('Server Running...');
})

// hasing passwords