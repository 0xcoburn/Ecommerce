const express = require('express');

const app = express();

//Form that the server sends
app.get('/', (req, res) => {
	res.send(`
        <div>
            <form method="Post">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>        
            </form>
        </div>
    `);
});

//Middleware to parse formData and add it to req.body
bodyParser = (req, res, next) => {
	if (req.method === 'POST') {
		req.on('data', (data) => {
			const parsed = data.toString('utf8').split('&');
			const formData = {};
			for (let pair of parsed) {
				const [ key, value ] = pair.split('=');
				formData[key] = value;
			}
			req.body = formData;
			next();
		});
	} else {
		next();
	}
};

//response to user after signing up
app.post('/', bodyParser, (req, res) => {
	console.log(req.body);
	res.send('account created');
});

//Server listening on port 3000
app.listen(3000, () => {
	console.log('listening -_-');
});
