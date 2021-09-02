const fs = require('fs');
const crypto = require('crypto');

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

    await this.writeAll(records)
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





}





const test = async () => {
  const repo = new UserRepositories('users.json');

  // await repo.create({ email: 'test@test.com', password: 'password' })
  // const users = await repo.getAll();

  // const user = await repo.getOne('qwqwqw2');
  // console.log(user);

  await repo.delete('5a9f9944');

}
test();
