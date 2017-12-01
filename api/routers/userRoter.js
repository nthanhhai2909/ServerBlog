'use strict'
module.exports = (app) => {
    var userController = require('../controllers/userController');

    app.route('/signup')
    .post(userController.signup);

    app.route('/login')
    .post(userController.login)
}