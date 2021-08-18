const User= require('../Model/User');

class UserService{
    static AddUser(userObj){
        return User.findOne(userObj)
    }
    
    static save(userObj){
        const user = new User(userObj);
        return user.save();
    }
    static allUsers(){
        return User.find();
    }
}
module.exports=UserService