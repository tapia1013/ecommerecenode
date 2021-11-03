const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);


class UserRepositories extends Repository {



  // This create will override the create method we created in the Repository cause we need this method specifically for this part
  async create(attrs) {
    // attrs always has {email: "", password:""}
    attrs.id = this.randomId();



    // hash and salt password
    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64)



    // {email: 'asdsd@m.com', pw: 'pw'}
    const records = await this.getAll();

    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    }

    records.push(record);



    await this.writeAll(records);

    return record;
  }


  // compare passwords after hash and salt
  async comparePasswords(saved, supplied) {
    // Saved -> password saved in our database('hashed.salt');
    // Supplied -> password given to us by user trying to sign in.


    // const result = saved.split('.');
    // const hashed = result[0];
    // const salt = result[1];

    // console.log(saved);
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    // add .toString() cause scrypt returns a buffer[]
    return hashed === hashedSuppliedBuf.toString('hex');

  }



}





// const test = async () => {
//   const repo = new UserRepositories('users.json');

//   // await repo.create({ email: 'test@test.com', password: 'password' })
//   // const users = await repo.getAll();

//   // const user = await repo.getOne('qwqwqw2');
//   // console.log(user);

//   // await repo.delete('5a9f9944');

//   // await repo.update('9969d28f', { password: 'mypassword' })

//   const user = await repo.getOneBy({
//     email: 'test@test.com',
//     password: 'mypassword'
//   })
//   console.log(user);
// }
// test();







// exporting this file, new UserRepo is an instance so we cna avoid issues trying to import in other files
module.exports = new UserRepositories('users.json');

