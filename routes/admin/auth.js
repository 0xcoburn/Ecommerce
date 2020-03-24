const express = require('express');

const { handleErrors } = require('./middleware');
const usersRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPasswordForUser
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signUpTemplate({ req }));
});

//response to user after signing up
router.post(
	'/signup',
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	handleErrors(signUpTemplate),
	async (req, res) => {
		const { email, password } = req.body;

		// create a user in our user repo for this person
		const user = await usersRepo.create({ email, password });

		//store the id of that user inside the users cookie
		req.session.userId = user.id;

		res.send('account created');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out');
});

router.get('/signin', (req, res) => {
	res.send(signInTemplate({}));
});

router.post(
	'/signin',
	[ requireEmailExists, requireValidPasswordForUser ],
	handleErrors(signInTemplate),
	async (req, res) => {
		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;

		res.send('You are signed in');
	}
);

module.exports = router;
