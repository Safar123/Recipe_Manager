const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Recipe must have a title']
    },
    description: {
        type: String,
        required: [true, 'Recipe must have a description']
    },
    instructions:{
        type: String,
        required: [true, 'Recipe must have a instruction']
    },
    steps: {
        type: [String],
    },
    images: {
        type: [String]
    },
    featuredImage: {
        type: String
    },
    prep_time: {
        type: Number,
    },
    cookingTime: {
        type: Number,
        required: [true, 'Please specify cooking time']
    },
    cookingTemp: {
        type: Number,
    },
    ingredients: [String],

    cost_per_serve: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'You must log in to create recipe']
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;