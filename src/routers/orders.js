const express = require('express');
const router = express.Router();
const Book = require('../Model/Books')
const Order = require('../Model/Orders');
const BookService = require("../service/bookService");
const OrderService = require('../service/orderService')
const LibraryService = require('../service/library-service')
const dayjs = require('dayjs')
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
        const orderDetails = await OrderService.getOrders(bookId, userId);
        if (orderDetails) {
            orderDetails.returnDate = new Date().toJSON();
            orderDetails.fine = LibraryService.getFineAmount(orderDetails.dueDate)
            const book = await BookService.getBookById({ _id: bookId })
            if (!book) {
                res.status(400).send("book not found");

            } else {
                book.quantity = LibraryService.addBookQuantity(book.quantity)
                BookService.save(book)
            }
            console.log(orderDetails)
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
            throw new Error('order not found')
        } else {
            const duedate = renewdate.dueDate
            const dif = LibraryService.getDiff(duedate)
            console.log(dif)
            if (dif < 0) {
                renewdate.dueDate = LibraryService.getRenewalDueDate(renewdate.dueDate);
                renewdate.status = "renewed"
            } else {
                console.log('you cant renew')
            }
        }
        renewdate.save()
        res.status(201).send('Book Renewed')
    } catch (error) {
        res.status(500).send({ error: error.message })

    }
})
router.post('/place-orders', async (req, res) => {
    try {
        const userId = req.body.userId
        const bookId = req.body.bookId
        const dueDate = LibraryService.getDueDate();
        const order = await Order({
            userId: userId,
            bookId: bookId,
            orderDate: req.body.orderDate,
            dueDate: dueDate,
            returnDate: null,
            fine: req.body.fine,
            status: req.body.status
        })
        const user = await Order.find({ userId: req.body.userId });
        const count = user.length
        console.log(count)
        if (count >= 3) {
            throw new Error('Already ordered 3 books')
        } else {
            Order.findOne({ $and: [{ userId: userId }, { bookId: bookId }] }, async (err, result) => {
                if (err) {
                    console.log('err')
                    throw new Error(err)
                } else {
                    console.log("hii", result)
                    if (result == null) {
                        const book = await BookService.getBookById({ _id: bookId })
                        if (!book) {
                            res.json({message:"book not found"})
                        } else {
                            book.quantity -= 1
                            BookService.save(book)
                            res.json({message:"book ordered successfully"})
                            OrderService.save(order)
                        }
                    } else {
                        res.status(201).send({message:"already ordered"})
                    }
                }
            })

        }

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});
module.exports = router;