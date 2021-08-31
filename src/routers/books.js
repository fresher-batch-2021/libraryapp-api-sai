const express = require("express");
const router = express.Router();
const Book = require('../Model/Books');
const Order = require('../Model/Orders');
const BookService = require("../service/bookService");
const OrderService = require('../service/orderService')
router.post('/add-book', async (req, res) => {
	const newbook = req.body;
	console.log(newbook)
	try {

		await BookService.addBook(newbook);
		res.status(201).send("Book Added Successfully");

	}
	catch (err) {
		console.log(err.message);
		res.status(500).send({ err: err.message })
	}

})

router.get('/get-all-books', async (req, res) => {
	try {
		let allBooks = await BookService.getAllBooks().sort({ createdAt: "desc" });
		let active = req.query.status;
		if (active) {
			allBooks = allBooks.filter(obj => obj.status === active);
		}
		console.log(allBooks)
		res.send(allBooks)

	} catch (error) {
		res.status(500).send({ error: error.message })
	}
})

router.get('/book-details', async (req, res) => {
	try {
		const bookDetails = await BookService.getBookDetails(req.query.bookName)
		console.log(bookDetails);
		res.status(201).send(bookDetails);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
})

router.get('/book-details/exists', async (req, res) => {
	try {
		const exists = await BookService.isExists(req.query.bookName)
		console.log(exists);
		res.status(200).send(exists);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
})


router.post('/author-book', async (req, res) => {
	try {
		const authorBooks = await BookService.getAuthorBook(req.body.authorName)
		console.log(authorBooks);
		res.status(201).send(authorBooks);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
})

router.delete('/delete/:id', async (req, res) => {
	try {
		await Book.findOne({ _id: req.params.id }, (err, o) => {
			if (err) {
				throw new Error(err)
			} else {
				Order.findOne({ bookId: req.params.id }, (err, s) => {
					if (err) {
						throw new Error(err)
					} else {
						const orderDetails = s
						if (orderDetails == null) {
							console.log(o)
							o.remove()
							res.status(200).send('book deleted')
						}
						else if (orderDetails.status == 'ordered' || 'renewed') {
							res.status(200).send('book has been ordered')
							return false
						} else {
							res.status(500).send('book not found')
						}
					}
				})
			}
		})
	} catch (error) {

	}
})

router.put('/update-book/:id', async (req, res) => {


	try {
		const updateBook = req.body;
		updateBook._id = req.params.id;
		BookService.updateBook(updateBook);
		res.status(200).send(updateBook);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}

});
router.put('/update-book-status/:id', async (req, res) => {


	try {
		let book = req.body;
		console.log(book)
		book._id = req.params.id;
		BookService.updateBookStatus(book);
		res.status(200).send(book);
	}
	catch (err) {
		console.log("error:" + err);
		res.status(500).send({ error: err.message });
	}

});

router.get("/get-book-by-id/:id", async (req, res) => {
	try {
		const bookId = req.params.id;
		const bookDetails = await BookService.getBookById(bookId);
		console.log(bookDetails)
		res.status(201).send(bookDetails)
	} catch (error) {
		res.status(500).send({ error: error.message });
		console.log(error)
	}
})

module.exports = router;