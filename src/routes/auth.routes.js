const express = require('express');
const { Router } = express;
const { userRegisterController, userLoginController, userLogoutController } = require('../controllers/auth.controller');

const router = Router()


/* POST /api/auth/register */
router.post("/register", userRegisterController)


/* POST /api/auth/login */
router.post("/login",userLoginController)

/**
 * - POST /api/auth/logout
 */
router.post("/logout", userLogoutController)



module.exports = router;