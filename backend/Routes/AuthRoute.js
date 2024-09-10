const { Signup, Login, Logout } = require('../Controllers/AuthController');
const { userVerification } = require('../Middlewares/AuthMiddleware');
const router = require('express').Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/verify', userVerification);
router.post('/logout', Logout); // Add this line for logout

module.exports = router;
