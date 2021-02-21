const users = require('../controllers/students.server.controller'),
    passport = require('passport');

// Define the routes module' method
module.exports = function(app) {
    app.get('/', users.render);
    
    /************ */    
    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);
    
    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local', {
            successRedirect: '/submit_comments',
            failureRedirect: '/signin',
            failureFlash: true
        }));

/************ */
    app.route('/submit_comments')
        .get(users.renderSubmitComments);

    app.route('/display')
        .get(users.display);

    app.route('/users')
        .post(users.create)
        .get(users.list);  

    app.route('/users/:userId')
        .get(users.read);
    
    app.param('userId', users.userByID);
    
    //DELETE
    app.route('/delete_user').get(users.showDeletePage);
    app.route('/delete').delete(users.deleteByUserName);

     //the form uses a post request to the same path ('/')
    // this will only accept the request : https://localhost:3000/thankyou (POST req)
    app.post('/thankyou', function (req, res) {
        //use the controller function
        users.displayInfo(req, res);
        //form.formInfo(req, res);
    
    });
    
};

