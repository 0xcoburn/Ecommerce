const layout = require('../layout');

module.exports = ({ req }) => {
	return layout({
		content : `
            <div>
                Your id is: ${req.session.userId}
                <form method="Post">
                    <input name="email" placeholder="email" />
                    <input name="password" placeholder="password" />
                    <input name="passwordConfirmation" placeholder="password confirmation" />
                    <button>Sign Up</button>        
                </form>
            </div>
        `
	});
};
