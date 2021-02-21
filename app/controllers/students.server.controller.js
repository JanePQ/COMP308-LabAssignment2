// Load the module dependencies
const User = require('mongoose').model('User');
const passport = require('passport');

exports.render = function(req, res) {
	// If the session's 'lastVisit' property is set, print it out in the console 
	if (req.session.lastVisit) {
		console.log(req.session.lastVisit);
	}
	// Set the session's 'lastVisit' property
	req.session.lastVisit = new Date();

	// Use the 'response' object to render the 'index' view with a 'title' property
	res.render('index', {
		title: 'Course Evaluation',
	});
};

// Create a new error handling controller method
const getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (const errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

// Create a new controller method that renders the signin page
exports.renderSignin = function (req, res, next) {
	
    //var email = req.user.email;
    //console.log(req.user.email);
	// If user is not connected render the signin page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signin page
		res.render('signin', {
			// Set the page title variable
			title: 'Login to evaluate the course: ',
			// Set the flash message variable
			//badmessage: req.flash('error') //passes the error stored in flash
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that renders the signup page
exports.renderSignup = function(req, res, next) {
	// If user is not connected render the signup page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signup page
		res.render('signup', {
			// Set the page title variable
			title: 'Sign-Up as Student',
			// read the message from flash variable
			badmessage: req.flash('error') //passes the error stored in flash
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
	// If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Create a new 'User' model instance
        const user = new User(req.body);
        console.log(req.body)
		const message = null;

		// Set the user provider property
		user.provider = 'local';

		// Try saving the new user document
		user.save((err) => {
			// If an error occurs, use flash messages to report the error
			if (err) {
				// Use the error handling method to get the error message
				const message = getErrorMessage(err);
                console.log(err)
				// save the error in flash
				req.flash('error', message); //save the error into flash memory

				// Redirect the user back to the signup page
				return res.redirect('/signup');
			}

			// If the user was created successfully use the Passport 'login' method to login
			req.login(user, (err) => {
				// If a login error occurs move to the next middleware
				if (err) return next(err);

				// Redirect the user back to the main application page
				return res.redirect('/');
			});
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
	// Try finding a user document that was registered using the current OAuth provider
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, (err, user) => {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a user could not be found, create a new user, otherwise, continue to the next middleware
			if (!user) {
				// Set a possible base username
				const possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

				// Find a unique available username
				User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
					// Set the available user name 
					profile.username = availableUsername;
					
					// Create the user
					user = new User(profile);

					// Try saving the new user document
					user.save(function(err) {
						// Continue to the next middleware
						return done(err, user);
					});
				});
			} else {
				// Continue to the next middleware
				return res.redirect(err, user);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the user back to the main application page
	res.redirect('/');
};

/************************
* FOR STUDENT LIST
************************/
/*exports.renderAddUser = function (req, res) {
    
    // Use the 'response' object to render the 'signup' view with a 'title' property
    res.render('signup', {
        title: 'Sign-Up as Student'
    });
    //you may also render an html form
    //res.render('add_user.html');
};
*/

/*exports.renderReadUser = function (req, res) {

    // Use the 'response' object to render the 'read_user' view with a 'title' property
    res.render('read_user', {
        title: 'Update Student Info'
    });
    
};
*/
// added submit_comments
exports.renderSubmitComments = function (req, res) {
    res.render('submit_comments', {
		title: 'Submit a Comment',
		userFullName: req.user ? req.user.fullName : ''
    });
    
};


// render comments_student
exports.renderCommentsByStudent = function (req, res) {

    // Use the 'response' object to render the 'signin' view with a 'title' property
    res.render('comments_student', {
        title: 'Student Comments '
    });
    
};

exports.displayInfo = function (req, res) {

    //get user input using request object
    var email = req.body.email;
    var comments = req.body.comments;
    //make a reference to the session object
    var session = req.session;
    //store the username in session object
    session.email = email;
    console.log("email in session: " + session.email);
    //show the display.ejs page and pass username to it
    res.render('thankyou', {
        email: email,
        //comments:"Welcome to the Course!",
        comments: comments
    });   

}; 

exports.formInfo = function (req, res) {
	 //get user input using request object
	var session = req.session;
	var email = req.body.email;
	session.email = email;
	console.log("email in session: " + session.email);
    res.render('form', {
		title: 'Hello Form',
		email: email
	});	
};  

// 'create' controller method to create a new user
exports.create = function(req, res, next) {
	// Create a new instance of the 'User' Mongoose model
	const user = new User(req.body);

	// Use the 'User' instance's 'save' method to save a new user document
	user.save((err) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(user);
		}
	});
};

// 'list' controller method to display all users in raw json format
exports.list = function(req, res, next) {
	// Use the 'User' static 'find' method to retrieve the list of users
	User.find({}, (err, users) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(users);
		}
	});
};

// 'display' controller method to display all users in friendly format
exports.display = function (req, res, next) {
    // Use the 'User' static 'find' method to retrieve the list of users
    User.find({}, (err, users) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.render('listall', {
                title: 'List All Users',
                users: users
            });
        }
    });
};

// 'read' controller method to display a user
exports.read = function(req, res) {
	// Use the 'response' object to send a JSON response    
	res.json(req.user);
};

/***************** 
* FOR DELETE
*/
// 'display' controller method to display all users in friendly format
exports.showDeletePage = function (req, res) {
    
    // Use the 'response' object to show the delete_user page
    res.render('delete_user', {
        title: 'Delete User' });
        
};

// 'read' controller method to display a user
exports.read = function(req, res) {
	// Use the 'response' object to send a JSON response    
	res.json(req.user);
};

// 'update' controller method to update a user based on id
exports.update = function (req, res, next) {
    req.user=req.body //read the user from request's body
    console.log(req.user)
	// Use the 'User' static 'findByIdAndUpdate' method to update a specific user
	User.findByIdAndUpdate(req.user.id, req.body, (err, user) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			//res.json(user);
            res.redirect('/users') //display all users
		}
	})
};

//update a user by username
exports.updateByUsername = function (req, res, next) {
    req.user = req.body //read the user from request's body
    console.log(req.user)
    //initialize findOneAndUpdate method arguments
    var query = { "username": req.user.username };
    var update = req.body;
    var options = { new: true };

    // Use the 'User' static 'findOneAndUpdate' method to update a specific user by user name
    User.findOneAndUpdate(query, update, options, (err, user) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            //res.json(user);
            res.redirect('/users') //display all users
        }
    })
};

// 'delete' controller method to delete a user
exports.delete = function(req, res, next) {
	// Use the 'User' instance's 'remove' method to delete user document
	req.user.remove((err) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(req.user);
		}
	})
};

//delete user by username
exports.deleteByUserName = function (req, res, next) {
    //
    console.log(req.body.username);
    User.findOneAndRemove({
        username: req.body.username
    }, function (err, user) {

        if (err) throw err;

        console.log("Success");

    });
    
    res.redirect('/display');


};

// 'userByID' controller method to find a user by its id or username
//  the code is using the username field instead of id
exports.userByID = function (req, res, next, id) {
	// Use the 'User' static 'findOne' method to retrieve a specific user
	User.findOne({
		_id: id //using the username instead of id
	}, (err, user) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Set the 'req.user' property
            req.user = user;
            console.log(user);
			// Call the next middleware
			next();
		}
	});
};
// 'userByEmail' controller method to find a user by its username
exports.userByEmail= function (req, res, next) {
    req.user = req.body //read the user from request's body
    // Use the 'User' static 'findOne' method to retrieve a specific user
    var email = req.body.email;
    console.log(email)
    User.findOne({
        email: email //finding a document by username
    }, (err, user) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Set the 'req.user' property
            req.email = email;
            //parse it to a JSON object
            var jsonEmail = JSON.parse(JSON.stringify(email));
            console.log(jsonEmail)
            //display edit page and pass user properties to it
            res.render('Signin', { title: 'Login to evaluate the course: ', email: jsonComment} );

            // Call the next middleware
            next();
        }
    });
};