const router = require('express').Router();
const { signUp, login, hello } = require('../controllers/user.controller');

router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/').post(hello);

module.exports = router; 