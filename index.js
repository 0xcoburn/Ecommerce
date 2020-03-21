const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

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

//response to user after signing up
app.post('/', (req, res) => {
	console.log(req.body);
	res.send('account created');
});

//Server listening on port 3000
app.listen(3000, () => {
	console.log('listening -_-');
});
