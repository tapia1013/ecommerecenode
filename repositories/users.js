const fs = require('fs');
const crypto = require('crypto');
const { throws } = require('assert');

class UserRepositories {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repo requires a filename');
    }

    this.filename = filename;

    // make sure files exists
    try {
      fs.accessSync(this.filename)
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }

  }

  async getAll() {
    // // Read its content
    // // console.log(contents);
    // // Parse the content
    // const data = JSON.parse(contents);
    // // return parsed data
    // return data;
    return JSON.parse(await fs.promises.readFile(this.filename, {
      encoding: 'utf8'
    }));
  }



  async create(attrs) {
    attrs.id = this.randomId();

    // {email: 'asdsd@m.com', pw: 'pw'}
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);

    return attrs;
  }



  async writeAll(records) {
    // write updated records array back to filename
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }



  randomId() {
    return crypto.randomBytes(4).toString('hex')
  }


  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }


  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }


  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`)
    }
    // record = {email: 'test@s.com'}
    // attrs = {pw: 'mypw'}
    Object.assign(record, attrs) // record === {email, pw}

    await this.writeAll(records)

  }




  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }

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
