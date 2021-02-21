var students = require('../controllers/comments.server.controller');
module.exports = function (app) {
    
    app.route('/show')
        .get(students.show);

    app.route('/students')
        .post(students.create)
        .get(students.list);
        
    app.route('/students/:userId')
        .get(students.read);
}; 
