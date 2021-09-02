const fs = require('fs')

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

  async checkForFile() { }
}

const repo = new UserRepositories('users.json');

