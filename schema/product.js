var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var ProductSchema=new Schema({
    ProductName:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number
    },
    image:{
        type:String
    },
    qty:{
        type:Number,
        default:1
    },
    description:{
        type:String,
        trim:true
    },
    SubCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory'
    }
},{
    collection:'Product',
    timestamps:true
});

module.exports=mongoose.model('Product',ProductSchema);