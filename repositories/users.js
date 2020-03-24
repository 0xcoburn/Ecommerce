const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	async comparePasswords(saved, supplied) {
		//destructure hashed and salt
		const [ hashed, salt ] = saved.split('.');
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuf.toString('hex');
	}

	// add new user to users.json
	async create(attributes) {
		attributes.id = this.randomId();

		//get salt to go with the password
		const salt = crypto.randomBytes(8).toString('hex');
		//hash the password and salt together
		const buf = await scrypt(attributes.password, salt, 64);
		//get records
		const records = await this.getAll();
		//add hashed password and salt to user attributes
		const record = {
			...attributes,
			password: `${buf.toString('hex')}.${salt}`
		};
		//push hashed password and salt to users.json
		records.push(record);

		await this.writeAll(records);

		return record;
	}
}

module.exports = new UsersRepository('users.json');
