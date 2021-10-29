const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();


app.use(express.static('public'))
// bodyparses everywhere in the app so we wont have to keep writing it
app.use(bodyParser.urlencoded({ extended: true }));
// cookie session is a middleware so we have to app.use
app.use(
  cookieSession({
    keys: ['ilysmb09131013']
  })
)
app.use(authRouter)


app.listen(3000, () => {
  console.log('Server Running...');
})

// hasing passwords