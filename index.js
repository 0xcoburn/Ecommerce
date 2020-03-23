const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys : [ 'hdfgdo87s8df3bvc29' ]
	})
);
app.use(authRouter);

//Form that the server sends

//Server listening on port 3000
app.listen(3000, () => {
	console.log('listening -_-');
});
