const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// bodyparses everywhere in the app so we wont have to keep writing it
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordconfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});



// we put the middleware inbetween '/',HERE,()=>{}
app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Account created!!!')
});



app.listen(3000, () => {
  console.log('Server Running...');
})


