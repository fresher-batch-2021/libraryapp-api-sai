const User= require('../Model/User');

class UserService{
    static findUser(userObj){
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