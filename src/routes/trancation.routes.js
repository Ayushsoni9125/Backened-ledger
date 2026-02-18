const { Router } = require ('express');
const authMiddleware = require('../middleware/auth.middleware')


const transcationRoutes = Router();


transcationRoutes.post("/", authMiddleware.authMiddleware)



module.exports = transcationRoutes;