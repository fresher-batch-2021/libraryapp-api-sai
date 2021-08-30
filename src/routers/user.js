const express = require('express');
const router = express.Router();
const User = require("../Model/User");
const bcrypt = require('bcryptjs');
const UserService = require('../service/userService');
const { route } = require('./request');


router.post('/addUser', async (req, res) => {
    const email = await UserService.findUser({ email: req.body.email })
    console.log(email);
    if (email === null) {
        bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
            if (err) {
                res.json({ error: err })
            }

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPass,
                role: req.body.role
            })
            try {
                console.log(newUser);
                UserService.save(newUser)
                res.status(201).send({ message: "Registered successful" })
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: err.message });
            }

        })
    }

    else if (email.email === req.body.email) {
        res.send({ message: "email already exits" })
    }
})

router.post('/login', (req, res) => {
    let password = req.body.password

    UserService.findUser({ email: req.body.email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        console.log(user.name)
                        const userData = { user_id: user._id, name: user.name, email: user.email, userRole: user.role }
                        console.log(userData);

                        res.json({ message: "login successful", userData });

                    } else {
                        res.json({
                            message: 'Invalid Password'
                        })
                    }
                })

            } else {
                res.json({
                    message: "Not a valid user"
                })
            }
        })
});

router.get('/get-all-users', async (req, res) => {
    try {
        const allUsers = await UserService.allUsers();
        res.status(201).send(allUsers);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

router.post('/verification', async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findOne({ email: req.body.email })
        console.log(user)
        user.status=req.body.status
        console.log(user)
         await user.save()
         res.status(201).send({message:"Verified"})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }

})

router.delete('/reject-user/:id',async(req,res)=>{
    try {
        const user = await User.findById({ _id: req.params.id })
        if(!user){
            res.json({message:"User Not Found"})
            console.log(user)
        }
        user.remove()
        res.send({message:"Rejected"});
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})
module.exports = router;
