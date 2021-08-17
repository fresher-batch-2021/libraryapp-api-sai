const express = require('express');
const router = express.Router();
const Book = require('../Model/Books')
const Order = require('../Model/Orders');
const dayjs = require('dayjs')
router.post('/place-orders', async (req, res) => {
    try {
        const date = dayjs().add(10, 'days').format('DD/MM/YYYY')
        console.log(date)
        const order = await Order({
            userId: req.body.userId,
            bookId: req.body.bookId,
            orderDate: req.body.orderDate,
            dueDate: date,
            fine: req.body.fine,
            status: req.body.status
        })
        const book = await Book.findOne({ _id: req.body.bookId })
        if (!book) {
            res.status(400).send("book not found");

        } else {
            book.quantity -= 1
            book.save();
            res.status(200).send(book)
        }
        console.log(order)
        order.save()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});
router.get('/order-details/:id', async (req, res) => {
    try {
        const orderdetails = await Order.find({ userId: req.params.id }).populate('bookId');
        console.log(orderdetails)
        res.status(201).send(orderdetails);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

router.get('/all-orders', async (req, res) => {
    try {
        const orderedBooks = await Order.find().populate('userId bookId')
        res.status(201).send(orderedBooks);
    } catch (error) {
        res.status(500).send({ error: error.messasge })
    }
})
router.patch('/return-book/:uid/:bid',async(req,res)=>{
    try {
        const userId=req.params.uid
        const bookId=req.params.bid
console.log(userId)
console.log(bookId)
        const orderDetails= await Order.findOne({$and:[{userId:userId},{bookId:bookId}]})
        if(orderDetails){
            console.log(orderDetails)
        }
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})
module.exports = router;