var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var MinCategorySchema=new Schema({
    MainCategoryname:{
        type:String,
        required:true,
        trim:true,
        unique:true
    }
},{
    collection:'MainCategory',
    timestamps:true
});

module.exports=mongoose.model('MainCategory',MinCategorySchema);