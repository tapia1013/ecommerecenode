const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// bodyparses everywhere in the app so we wont have to keep writing it
app.use(bodyParse.urlendcoded({ extended: true }));


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




// middleware for app.post
// const bodyParse = (req, res, next) => {
//   if (req.method === 'POST') {
//     req.on('data', data => {
//       // returns a <Buffer 23 23 12 41 /> so we have toString('utf8') to be able to read it 
//       // console.log(data.toString('utf8'));

//       // we have to parse it and add info to an object
//       const parsed = data.toString('utf8').split('&');
//       const formData = {};

//       // loop through parsed array
//       for (let pair of parsed) {
//         const [key, value] = pair.split('=');
//         formData[key] = value;
//       }
//       // shows this{email: 'asds', passowrd: 'adssad'}
//       // console.log(formData);


//       req.body = formData;
//       next();
//     });
//   } else {
//     next();
//   }
// }





// we put the middleware inbetween '/',HERE,()=>{}
app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Account created!!!')
});






app.listen(3000, () => {
  console.log('Server Running...');
})







