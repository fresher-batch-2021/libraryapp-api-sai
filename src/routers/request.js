const express = require("express");
const router = express.Router();
const Request_book = require('../Model/Request_book')
const Book = require('../Model/Books')
router.post('/add-request', async (req, res) => {
    try {
        const newRequest = await Request_book.findOne({ bookName: req.body.bookName });
        const books = await Book.findOne({ bookName: req.body.bookName })
        console.log(newRequest)
        if (newRequest !== null) {
            res.send("Book Already Requested")
            console.log(books)

        } else if (books !== null) {
            res.send('Book Already Exists')
            return false
        } else {
            const addBook = new Request_book(req.body)
            await addBook.save()
            res.send("Book Added Successfully")
        }
    } catch (err) {
        res.status(500).send({ err: err.message });
    }
})

router.get('/all-requests', async (req, res) => {
    try {
        const allRequests = await Request_book.find().populate('requestedUsers','name')
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
router.patch('/add-count/:id', async (req, res) => {
    try {
        const addcount = await Request_book.findOne({ _id: req.params.id })
        addcount.requestedUsers += 1
        addcount.save()
        console.log(addcount)
        res.status(201).send('Added Your Request')
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
})
router.post('/add-count', async (req, res) => {
    const request = await Request_book.findOne({ _id: req.body._id });
    console.log(request)
    const user = req.body.user_id
    console.log(user)
    const newRequest = request.requestedUsers.includes(user)
    console.log(newRequest);
    if (newRequest === true) {
        request.requestedUsers.remove(user)
    }
    else {
        request.requestedUsers.push(user)
    }
    try {
        await request.save();
        res.status(201).send("Added Your Request");
    } catch (err) {
        res.status(500).send({err:err.message})
    }
})

module.exports = router;
