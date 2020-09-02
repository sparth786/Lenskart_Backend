var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var OrderSchema=new Schema({
    orderdate:{
        type:Date,
        default:Date()
    },
    tot_price:{
        type:Number
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    CheckoutId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Checkout'
    },
    paypal_orderid:{
        type:String
    },
    payer:{
        type:Object
    },
    paypal_status:{
        type:String
    },
    purchase_units:{
        type:Array
    },
},{
    collection:'Order',
    timestamps:true
});

module.exports=mongoose.model('Order',OrderSchema);