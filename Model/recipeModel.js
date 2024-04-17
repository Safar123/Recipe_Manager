const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Recipe must have a title']
    },
    description:{
        type:String,
        required:[true, 'Recipe must have a description']
    },
    steps:{
      type: [String],
       required:[true, 'Please define steps for your recipe' ]
    },
       images:{
        type:[String]
       },
       featuredImage:{
        type:String
       },
       cookingTime:{
        type:String,
        required:[true, 'Please specify cooking time']
       },
       cookingTemp:{
        type:String,
        required:[true, 'Please specify cooking temperature']
       },
       createdAt:{
   type:Date,
   default:Date.now()
       },
       createdBy:{
        type:String
       }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports= Recipe;