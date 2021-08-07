const express = require('express');
const router = express.Router();
const User = require("../Model/User");
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

router.post('/addUser', async (req, res) => {
	const email =await  User.findOne({email:req.body.email})
console.log(email);
		 if (email === null ) {
			bcrypt.hash(req.body.password,10,(err,hashedPass)=>{
				if (err) {
					res.json({error:err})
				}
			
		const newUser = new User({
					name:req.body.name,
					email:req.body.email,
                    phone:req.body.phone,
					password:hashedPass,
					role:req.body.role
			})
			try {
					  console.log(newUser);
					 newUser.save()
					.then((e)=>res.status(201).send({data:e,message:"Registered successfully"}))
					.catch((e)=>console.log(e));
					} catch (err) {
					res.status(500).send({error:err.message});
				}
		
			})
		 }
		
		else if(email.email_id === req.body.email_id){
           res.send({message:"email already exits"})
		}
})

router.post('/login',(req,res)=>{
    var password=req.body.password
 
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            bcrypt.compare(password,user.password,function(err,result){
                if(err){
                    res.json({
                        error:err
                    })
                }
                if(result){
                    let token =jwt.sign({name:user.name},'verySecret',{expiresIn:'1h'})
                    res.json({message:"login successfull",token});
                    
                }else{
                    res.json({
                        message:'Invalid Password'
                    })
                }
            })

        }else{
            res.json({
                message:"Not a valid user"
            })
        }
    })
});

router.get('/get-all-users',async(req,res)=>{
    try {
        const allUsers=await User.find();
        res.status(201).send(allUsers);
    } catch (error) {
         res.status.send({error:error.message});
    }
})

module.exports = router;
