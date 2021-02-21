//Controller function for displaying comments
const Comment = require('mongoose').model('Comment');

exports.commentsByStudent = function (req, res, next) {
    var email = req.session.email;
    //find the student then its comments using Promise mechanism of Mongoose
    User.
        findOne({ email: email }, (err, user) => {
            if (err) { return getErrorMessage(err); }
            //
            req.id = user._id;
            console.log(req.id);
        }).then(function () {
            //find the posts from this author
            Comment.
                find({
                    student: req.id
                }, (err, comment) => {
                    if (err) { return getErrorMessage(err); }
                    //res.json(comments);
                    res.render('comments_student', {
                        comment: comment, email: email
                    });
                });
        });
};
/******************
 * FOR COMMENT LIST 
 ******************/
exports.create = function(req, res, next) {
	// Create a new instance of the 'User' Mongoose model
	const comment = new Comment(req.body);

	// Use the 'User' instance's 'save' method to save a new user document
	comment.save((err) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(comment);
		}
	});
};

// 'list' controller method to display all users in raw json format
exports.list = function(req, res, next) {
	// Use the 'User' static 'find' method to retrieve the list of users
	Commment.find({}, (err, students) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(students);
		}
	});
};

// 'display' controller method to display all users in friendly format
exports.show = function (req, res, next) {
    Comment.find({}, (err, students) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.render('comments_student', {
                title: 'Comments by ',
                students: students
                
            });
        }
    });
};

// 'read' controller method to display a user
exports.read = function(req, res) {
	// Use the 'response' object to send a JSON response    
	res.json(req.user);
};

// 'userByID' controller method to find a user by its id or username
//  the code is using the username field instead of id
exports.userByID = function (req, res, next, id) {
	// Use the 'User' static 'findOne' method to retrieve a specific user
	Comment.findOne({
		_id: id //using the username instead of id
	}, (err, comment) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Set the 'req.user' property
            req.comment = comment;
            console.log(comment);
			// Call the next middleware
			next();
		}
	});
};

// 'userByUsername' controller method to find a user by its username
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
            req.comment = comment;
            //parse it to a JSON object
            var jsonComment = JSON.parse(JSON.stringify(comment));
            console.log(jsonComment)
            //display edit page and pass user properties to it
            res.render('submit_comments', { title: 'Submit Comments', comment: jsonComment} );

            // Call the next middleware
            next();
        }
    });
};

/***************** 
* FOR DELETE
*/

