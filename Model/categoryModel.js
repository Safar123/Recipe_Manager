const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please specify ingredient name'],
        unique:true
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    }
});

const Ingredient= mongoose.model('Category', categorySchema);

module.exports = Category;