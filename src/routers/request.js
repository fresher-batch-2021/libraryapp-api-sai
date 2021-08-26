const express = require("express");
const router = express.Router();
const Request_book=require('../Model/Request_book')


router.post('/add-request', async (req, res) => {

try {
    const newRequest = new Request_book(req.body);
    await newRequest.save()
 res.status(201).send(newRequest)
} catch (err) {
    res.status(500).send({err:err.message});
}
})

router.get('/all-requests',async(req,res)=>{
    try {
        const allRequests= await Request_book.find().populate('userId','name')
        res.status(200).send(allRequests);
    } catch (error) {
      res.status(500).send({err:error.message})  
    }
});
router.get('/user-requests',async(req,res)=>{
    try {
        const userRequests=await Request_book.find({userId:req.body.userId})
        res.status(200).send(userRequests)
    } catch (error) {
        res.status(500).send({err:error.message})  
    }
})
module.exports=router;
