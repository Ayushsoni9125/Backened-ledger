const express = require('express');
const cookieparser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const accRouter = require('./routes/account.routes');
const transcationRoutes = require('./routes/trancation.routes');

const app = express();


app.use(express.json());
app.use(cookieparser());


app.use("/api/auth", authRouter);
app.use("/api/account", accRouter);
app.use("/api/transaction", transcationRoutes);




module.exports = app;