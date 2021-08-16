const express = require('express');
const router = express.Router();
const Book =require('../Model/Books')
const Order = require('../Model/Orders');

router.post('/place-orders', async (req, res) => {
  try {
    const order=await Order(req.body)
    const book=await Book.findOne({_id:req.body.bookId})
    if(!book){
        res.status(400).send("book not found");

    }else{
       book.quantity-=1
       book.save();
        res.status(200).send(book)
    }
    console.log(order)
    order.save()
  } catch (error) {
      res.status(500).send({error:error.message})
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