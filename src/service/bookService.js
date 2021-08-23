const Book = require("../Model/Books");
const BookDAO = require("../dao/book-dao");

class BookService {

    static async addBook(newbook) {

        //Validation
        if (newbook.bookName == null || newbook.bookName.trim() == "") {
            throw new Error("Bookname cannot be empty/blank")
        }

        // Business Validation- check whether book already exists
        const isBookExists = await this.isExists(newbook.bookName);
        //try {
        if (isBookExists) {
            throw new Error('Book Already Exists')
        }

        //Save book details to db
        let result = await BookDAO.save(newbook);

        return result;
        // } catch (err) {
        //     console.error(err.message);
        //     throw new Error("Enter All the Fields");
        // }

    }

    static async isExists(bookName) {
        let bookDetails = await BookDAO.findByBookName(bookName);
        return bookDetails != null;
    }


    static save(bookObj) {

        return BookDAO.save(bookObj);
    }
    static getAllBooks() {
        return BookDAO.findAll();
    }
    static getBookDetails(bookName) {
        return BookDAO.findByBookName(bookName);
    }
    static getBookById(bookId) {
        return BookDAO.findById(bookId)
    }
    static getAuthorBook(authorName) {
        return BookDAO.findByAuthorName({ authorName })
    }
    static remove(bookObj) {

        return BookDAO.remove(bookObj);
    }

    static deleteBook(bookId) {
        
        return BookDAO.deleteBook(bookId);

    }


    static async updateBook(book) {
      
        const updates = Object.keys(book);
        console.log(updates);

        const allowedUpdates = ['bookName', 'authorName', 'category', 'price', 'quantity', 'description', 'image'];
        const isValidOperation = allowedUpdates.every((fieldName) => {
            return updates.includes(fieldName);
        });

        if (!isValidOperation) {
            throw new Error('Invalid Operation');
        }

        //2. Check is valid book
        const bookObj = await BookDAO.findById(book._id)
        console.log(bookObj);
        if (!bookObj) {

            throw new Error('book not found');
        }

        //3. modify fields and then update`
        updates.forEach((update) => {
            bookObj[update] = book[update];
        });
        return await BookDAO.save(bookObj);


    }
    static async updateBookStatus(book) {
        //1. Validation
        const updates = Object.keys(book);
        console.log("h",updates);
        const allowedUpdates = ['status'];
        const isValidOperation = updates.every((update) => {
            let exist = allowedUpdates.includes(update);
            if (!exist) {
                console.log("s",update);
            }
            return exist;
        });



        if (!isValidOperation) {
            throw new Error('Invalid Operation');
        }


        //2. Check is valid book
        const bookObj = await BookDAO.findById(book._id)
        console.log("y",bookObj);
        if (!bookObj) {

            throw new Error('book not found');
        }

        //3. modify fields and then update
        updates.forEach((update) => {
            bookObj[update] = book[update];
        });
        return await BookDAO.save(bookObj);


    }
}

module.exports = BookService;