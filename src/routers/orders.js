const express = require('express');
const router = express.Router();
const Order = require('../Model/Orders');

router.post('/place-orders', async (req, res) => {
    try {
        console.log(req.body);
        const placeOrder = await Order(req.body);
        placeOrder.save();
        res.status(201).send(placeOrder);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.get('/order-details/:id', async (req, res) => {
    try {
        const orderdetails = await Order.find({userId:req.params.id}).populate('bookId');
        console.log(orderdetails)
        res.status(201).send(orderdetails);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})
router.get('/all-orders',async(req,res)=>{
    try {
        const orderedBooks= await Order.find().populate('userId bookId')
        res.status(201).send(orderedBooks);
    } catch (error) {
        res.status(500).send({error:error.messasge})
    }
})
module.exports = router;