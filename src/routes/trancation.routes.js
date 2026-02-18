const { Router } = require ('express');
const authMiddleware = require('../middleware/auth.middleware')
const transactionController = require('../controllers/transcation.controller')

const transcationRoutes = Router();


transcationRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTranscation)


transcationRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction);



module.exports = transcationRoutes;