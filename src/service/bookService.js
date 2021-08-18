const Book = require("../Model/Books");

class BookService{
    static addBook(bookName,callback){
        Book.findOne({ bookName} ,callback)
    }

    static save(bookObj){
        const book = new Book(bookObj);
        return book.save();
    }
    static getAllBooks(){
        return Book.find()
    }
    static getBookDetails(bookName){
       return Book.findOne({bookName})
    }
    static getBookById(bookId){
        return Book.findById(bookId)
    }
    static getAuthorBook(authorName){
       return Book.find({authorName})
    }
    static remove(bookObj){
        const book=Book(bookObj);
        return book.remove();
    }

    static deleteBook(bookId,callback){
       return Book.findById(bookId,callback)

    }
}

module.exports=BookService;