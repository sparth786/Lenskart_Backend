var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var CheckoutSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    mobileno:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
    },
    state:{
        type:String,
        trim:true
    },
    city:{
        type:String,
        trim:true
    },
    pincode:{
        type:String
    },
    address:{
        type:String,
        trim:true
    },
    loginuserid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    collection:'Checkout',
    timestamps:true
});

module.exports=mongoose.model('Checkout',CheckoutSchema);