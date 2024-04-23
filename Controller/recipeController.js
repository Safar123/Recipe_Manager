const Recipe = require('../Model/recipeModel');

exports.getAllRecipe = async (req, res)=>{

    try{
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`);

        let query = Recipe.find(JSON.parse(queryStr));
if(req.query.sort){
    const sortBy = req.query.sort().split(',').join(' ');
    query = query.sort(sortBy);
}
else{
    query =query.sort('-createdAt');
}
        const allRecipe = await query;
        if(!allRecipe || allRecipe.length === 0){

    res.status(404).json({
        status:'success',
        message: 'No recipe added yet'
    })
        }

        res.status(200).json({
            status:'success',
            recipes: allRecipe
        })

    }

    catch(err){

    }
}

exports.getSingleRecipe = async (req, res)=>{
    try{

        const oneRecipe= await Recipe.findById(req.params.id);
        if(!oneRecipe){
            res.status(404).json({
                status:'fail',
                message:`No such recipe for ${req.params.id}`
            })
        }

        res.status(200).json({
            status:'Success',
            recipe:oneRecipe
        })
    }

    catch(err){
        res.status(500).json({
            status:'fail',
            message:err
        })
    }

   
}

exports.generateRecipe = async (req, res)=>{
    try{
        const genRecipe = await Recipe.create(req.body);
        if(!req.body){
          res.status(400).json({
            status:'fail',
            message:'Please provide all the information required  (* Required Field)'
          })
        }

        res.status(201).json({
            status:'success',
            created_Recipe: genRecipe
        })
        
    }
    catch(err){
        res.status(500).json({
            status:'fail',
            message:' Something went wrong'
        })

    }
   
}

exports.updateRecipe = async (req, res)=>{
    try{
        let updateRecipe = await Recipe.findById(req.params.id);
        if(!updateRecipe || updateRecipe.length === 0){
            res.status(404).json({
                status:'fail',
                message:`No recipe by such ${req.params.id} id`
            })
        }
        updateRecipe= await Recipe.findByIdAndUpdate(updateRecipe.id, req.body, {
            new:true,
            runValidators:true
        })

    }
    catch(err){
        res.status(500).json({
            status:'fail',
            message:'Something went wrong'
        })
    }
}

exports.removeRecipe = async (req,res)=>{

    try{
        let delRecipe = await Recipe.findById(req.params.id);
        if(!delRecipe || delRecipe.length === 0){
            res.status(404).json({
                status:'fail',
                message:`No such recipe by ${req.params.id} id`
            })
        }

        delRecipe = await Recipe.findByIdAndDelete(delRecipe.id);
    }
    catch (err){
        res.status(500).json({
            status:'fail',
            message:err
        })
    }
}