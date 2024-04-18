const express = require ('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const userRoute = require('./Routes/userRoutes');


if (process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}

app.use('/api/v1', userRoute);

module.exports=app;