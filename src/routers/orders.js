const express = require('express');
const router = express.Router();
const Book = require('../Model/Books')
const Order = require('../Model/Orders');
const BookService = require("../service/bookService");
const OrderService = require('../service/orderService')
const LibraryService = require('../service/library-service')
const dayjs = require('dayjs')
router.post('/place-orders', async (req, res) => {
    try {
        // const dueDate = dayjs().add(10, 'days').format('YYYY-MM-DD')
        const dueDate = LibraryService.getDueDate();
        const order = await Order({
            userId: req.body.userId,
            bookId: req.body.bookId,
            orderDate: req.body.orderDate,
            dueDate: dueDate,
            returnDate: null,
            fine: req.body.fine,
            status: req.body.status
        })
        const book = await BookService.getBookById({ _id: req.body.bookId })
        if (!book) {
            res.status(400).send("book not found");

        } else {
            book.quantity -= 1
            BookService.save(book)
            res.status(200).send(book)
        }
        console.log(order)
        OrderService.save(order)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});
router.get('/order-details/:id', async (req, res) => {
    try {
        const orderdetails = await OrderService.userOrders({ userId: req.params.id }).populate('bookId').sort({ createdAt: "desc" });
        console.log(orderdetails)
        res.status(201).send(orderdetails);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

router.get('/all-orders', async (req, res) => {
    try {
        const orderedBooks = await OrderService.allOrders().populate('userId bookId')
        res.status(201).send(orderedBooks);
    } catch (error) {
        res.status(500).send({ error: error.messasge })
    }
})
router.patch('/return-book/:uid/:bid', async (req, res) => {
    try {
        const userId = req.params.uid
        const bookId = req.params.bid
        console.log(userId)
        console.log(bookId)
        const orderDetails = await OrderService.getOrders(bookId, userId);
        console.log(orderDetails)
        if (orderDetails) {
            orderDetails.returnDate = new Date().toJSON();
            orderDetails.fine = LibraryService.getFineAmount(orderDetails.dueDate)
            const book = await BookService.getBookById({ _id: bookId })
            if (!book) {
                res.status(400).send("book not found");

            } else {
               book.quantity=LibraryService.addBookQuantity(book.quantity)
                console.log(book)
               BookService.save(book)
            }
            
            OrderService.save(orderDetails);
            res.status(201).send("pay fine Rs:" + orderDetails.fine);
        }
        else {
            res.send("order not found")
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.patch('/renew-date/:uid/:bid', async (req, res) => {
    try {
        const userId = req.params.uid
        const bookId = req.params.bid
        const renewdate = await Order.findOne({ $and: [{ userId: userId }, { bookId: bookId }] })
        if (!renewdate) {
            console.log('not found')
        } else {
            const duedate = renewdate.dueDate
            const dif = LibraryService.getDiff(duedate)
            console.log(dif)
            if (dif < 0) {
                renewdate.dueDate = LibraryService.getRenewalDueDate(renewdate.dueDate);
                console.log(duedate)
                console.log('you can renew')
            } else {
                console.log('you cant renew')
            }
        }
        renewdate.save()
        res.status(201).send(renewdate)
    } catch (error) {
        res.status(500).send({ error: error.message })

    }
})

module.exports = router;