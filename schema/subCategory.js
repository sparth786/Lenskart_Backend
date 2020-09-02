var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var SubCategorySchema=new Schema({
    SubCategoryname:{
        type:String,
        required:true,
        trim:true
    },
    mainCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MainCategory'
    }
},{
    collection:'SubCategory',
    timestamps:true
});

module.exports=mongoose.model('SubCategory',SubCategorySchema);