const express = require('express');
const router = express.Router();
const Order = require('../Model/orders');

router.post('/place-orders', async (req, res) => {
    try {
        const placeOrder = await Order(req.body);
        placeOrder.save();
        res.status(201).send(placeOrder);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.get('/order-details',async(req,res)=>{
    try {
        const orderdetails= await Order.find().populate('userid bookid');
        res.status(201).send(orderdetails);
    } catch (error) {
     res.status(500).send({error:error.message});   
    }
})
module.exports=router;