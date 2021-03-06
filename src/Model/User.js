const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema = new Schema({
    name:{
      type:String,required:true
    },
    email:{
        type:String,required:true
    },
    password:{
        type:String,required:true
    },
    role:{
        type:String,default:"user"
    },
    status:{
          type:String,default:"notverified"
    }
},{timestamps:true});
module.exports = User = mongoose.model('user', UserSchema)
