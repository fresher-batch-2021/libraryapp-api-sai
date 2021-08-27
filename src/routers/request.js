const express = require("express");
const router = express.Router();
const Request_book = require('../Model/Request_book')
const Book=require('../Model/Books')

router.post('/add-request', async (req, res) => {
    try {
    const newRequest = await Request_book.findOne({ bookName: req.body.bookName });
    const books=await Book.findOne({bookName: req.body.bookName})
    console.log(books)
        if (newRequest === null&&books===null) {
            const addBook = new Request_book( { bookName: req.body.bookName,userId: req.body.userId })
            await addBook.save()
            res.send("Book Added Successfully")
            }else{
            res.status(201).send("Book Already Requested or Book Already Exists");
        }
    } catch (err) {
        res.status(500).send({ err: err.message });
    }
})

router.get('/all-requests', async (req, res) => {
    try {
        const allRequests = await Request_book.find().populate('userId', 'name')
        res.status(200).send(allRequests);
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
});
router.get('/user-requests', async (req, res) => {
    try {
        const userRequests = await Request_book.find({ userId: req.body.userId })
        res.status(200).send(userRequests)
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
})

module.exports = router;
