require('dotenv').config();

const express = require('express');
const app = express();
var cors = require('cors');


const connectDB = require('./config/db');

//Connect Database
connectDB();

//Init Middleware for accepting data from body
app.use(express.json({ extended: false }));

//Use cors
app.use(cors());

//Define Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/fund', require('./routes/fund'));
app.use('/api/v1/budgets', require('./routes/budget'));
app.use('/api/v1/history', require('./routes/history'));
app.use('/api/v1/expenses', require('./routes/expense'));


app.listen(process.env.PORT, () =>
	console.log(`${process.env.APP_NAME} server started on port ${process.env.PORT}`)
);
