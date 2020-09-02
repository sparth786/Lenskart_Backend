var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var UserSchema=new Schema({
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    mobileno:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    usercart:{
        type:Array
    },
    userrole:{
        type:String,
        enum:['Admin','User'],
        trim:true,
        default:'User'
    }
},{
    collection:'User',
    timestamps:true
});

module.exports=mongoose.model('User',UserSchema);