var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var OrderDetailSchema=new Schema({
    price:{
        type:Number
    },
    qty:{
        type:Number,
        default:1
    },
    ProductId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    OrderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order'
    }
},{
    collection:'OrderDetail',
    timestamps:true
});

module.exports=mongoose.model('OrderDetail',OrderDetailSchema);