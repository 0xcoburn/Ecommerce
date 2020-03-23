const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}

		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}
	// parse file data and return
	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding : 'utf8'
			})
		);
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
			password : `${buf.toString('hex')}.${salt}`
		};
		//push hashed password and salt to users.json
		records.push(record);

		await this.writeAll(records);

		return record;
	}

	async comparePasswords(saved, supplied) {
		//destructure hashed and salt
		const [ hashed, salt ] = saved.split('.');
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuf.toString('hex');
	}

	// write all records to users.json
	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	// generate random userId
	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	// get by Id
	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	// delete by Id
	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	// update user by Id
	async update(id, attributes) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}

		Object.assign(record, attributes);
		await this.writeAll(records);
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

module.exports = new UsersRepository('users.json');
