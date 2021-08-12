const express = require("express");
const router = express.Router();
const Book = require('../Model/Books');
const Order= require('../Model/Orders');

router.post('/add-book', async (req, res) => {
	const newbook = new Book(req.body);
	const bookName = req.body.bookName
	console.log(bookName, newbook)
	try {
		Book.findOne({ bookName }, function (err, result) {
			if (err) {
				throw (err);
			} else if (!result) {
				try {
					newbook.save()
						.then((e) => res.status(201).send("Book Added Successfully"))
						.catch((e) => console.log(e))
				} catch (err) {
					res.status(500).send("Enter All the Fields");
				}
			} else {
				res.send({ message: 'Book Already Exists' })
			}
		})
	}
	catch (err) {
		res.send({ err: err.message })
	}

})

router.post('/get-all-books', async (req, res) => {
	try {
		let allBooks = await Book.find();
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

router.post('/book-details', async (req, res) => {
	try {
		const bookDetails = await Book.find({ bookName: req.body.bookName })
		console.log(bookDetails);
		res.status(201).send(bookDetails);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
})


router.post('/author-book', async (req, res) => {
	try {
		const authorBooks = await Book.find({ authorName: req.body.authorName })
		console.log(authorBooks);
		res.status(201).send(authorBooks);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
})

router.delete('/delete-book/:id', async (req, res) => {
	try {
		Book.find(req.params.id, (err, result) => {
			if (err) {
				console.log(err)
			} else {
				Order.findOne({$and:[{ bookId: { $eq: req.params.id } }]}, (err, q) => {
					if(err){
						console.log(err)
					}else{
						console.log(q);
					}
				})
				console.log(result);
			}
			
		})

	} catch (error) {
		res.status(500).send({ error: error.message });
	}
})
router.put('/update-book/:id', async (req, res) => {

	const updates = Object.keys(req.body);
	console.log(updates);
	const allowedUpdates = ['bookName', 'authorName', 'category', 'price', 'quantity', 'description', 'image'];
	const isValidOperation = allowedUpdates.every((fieldName) => {
		return updates.includes(fieldName);
	});

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid Operation' });
	}

	try {
		const updateBook = await Book.findById(req.params.id)
		console.log(updateBook);
		if (!updateBook) {

			return res.status(404).send({ error: 'Book not found' });
		}
		updates.forEach((update) => {
			updateBook[update] = req.body[update];
		});
		await updateBook.save();
		res.send(updateBook);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}

});
router.put('/update-book-status/:id', async (req, res) => {

	const updates = Object.keys(req.body);
	console.log(updates);
	const allowedUpdates = ['status'];
	const isValidOperation = updates.every((update) => {
		let exist = allowedUpdates.includes(update);
		if (!exist) {
			console.log(update);
		}
		return exist;
	});

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid Operation' });
	}

	try {
		const book = await Book.findById(req.params.id)
		console.log(book);
		if (!book) {

			return res.status(404).send({ error: 'book not found' });
		}
		updates.forEach((update) => {
			book[update] = req.body[update];
		});
		await book.save();
		res.send(book);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}

});

router.get("/get-book-by-id/:id", async (req, res) => {
	try {
		const bookId = req.params.id;
		const bookDetails = await Book.findById(bookId);
		console.log(bookDetails)
		res.status(201).send(bookDetails)
	} catch (error) {
		res.status(500).send({ error: error.message });
		console.log(error)
	}
})

module.exports = router;