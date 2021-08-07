const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema = new Schema({
    name:{
      type:String,required:true
    },
    email:{
        type:String,required:true
    },
    phone:{
        type:Number,require:true
    },
    password:{
        type:String,required:true
    },
    role:{
        type:String,default:"user"
    }
},{timestamps:true});
module.exports = User = mongoose.model('user', UserSchema)
