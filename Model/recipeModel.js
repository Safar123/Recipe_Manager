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
    featuredImgURL: {
        type: String
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

    timeToComplete:{
        type:Number,

    },
    cookingTemp: {
        type: Number,
    },


    ingredients: [String],

    cost_per_serve: {
        type: Number
    },

    foodType:{
        type:String
        // required:[true, 'Please provide your food type (indian, chinese, continental)']

    },
    difficulty:{
        type:String,
        enum:['easy', 'medium', 'hard', 'pro']

    },

    tags:{
        type:[String]

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    contentTime:{
        type:Number

    },
    createdBy: {
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
});

recipeSchema.pre('save', function (next){
this.timeToComplete = this.cookingTime + this.prep_time;
next();
})

recipeSchema.pre('save', async function(next){
   const averageSpeed = 200;
   const words = this.description.split(/\s+/).length +this.instructions.split(/\s+/).length
    this.contentTime = Math.ceil(words/averageSpeed);
    next();
})
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;