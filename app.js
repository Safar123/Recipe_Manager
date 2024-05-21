const express = require ('express');
const morgan = require('morgan');
const GlobalError = require('./utils/globalError');
const errorHandler = require('./Controller/errorController');

const app = express();
app.use(express.json());

const userRoute = require('./Routes/userRoutes');
const recipeRoute = require('./Routes/recipeRoute');
const reviewRoute = require('./Routes/reviewRoutes');
const categoryRoute = require('./Routes/categoryRoute');


if (process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
} else {
    // console.log = function () {}
}

app.use('/api/v1/user', userRoute);
app.use('/api/v1/recipe', recipeRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/categories', categoryRoute);


app.all('*', (req, res, next)=>{
    next(new GlobalError(`This ${req.originalUrl} link is not defined on this server`, 404));
})
app.use(errorHandler);
module.exports=app;