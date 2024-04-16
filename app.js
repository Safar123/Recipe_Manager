const express = require ('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}
app.get('/', (req,res)=>{
    res.status(200).json({message:'Hello from the server side',
app:'Recipe Manager'});
})

module.exports=app;