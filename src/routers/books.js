const express = require("express");
const router = express.Router();

const Book = require('../Model/Books');

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
						.then((e) => res.status(201).send( "Book Added Successfully"))
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
		const allBooks = await Book.find();
		res.status(201).send(allBooks);
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
		const deleteBook = await Book.findById(req.params.id)
		if (!deleteBook) {
			res.status(201).send("No book found");
		}
		else {
			deleteBook.remove();
			res.status(201).send(deleteBook);
		}

	} catch (error) {
		res.status(500).send({ error: error.message });
	}
})
router.put('/update-book/:id', async (req, res) => {

	const updates = Object.keys(req.body);
	console.log(updates);
	const allowedUpdates = ['bookName', 'authorName', 'category', 'price', 'quantity','description','image'];
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

router.get("/get-book-by-id/:id",async(req,res)=>{
	try {
		const bookId = req.params.id;
		const bookDetails=await Book.findById(bookId);
		console.log(bookDetails)
		res.status(201).send(bookDetails)
	} catch (error) {
		res.status(500).send({error:error.message});
		console.log(error)
	}
})

module.exports = router;