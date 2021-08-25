const Book = require("../Model/Books");

class BookDAO{
    static addBook(bookName,callback){
        Book.findOne({ bookName} ,callback)
    }

    static save(bookObj){
        const book = new Book(bookObj);
        console.log(book)
        return book.save();
    }
    static findAll(){
        return Book.find()
    }
    static findByBookName(bookName){
       return Book.findOne({bookName})
    }
    static findById(bookId){
        return Book.findById(bookId)
    }
    static findByAuthorName(authorName){
       return Book.find({authorName})
    }
    static remove(bookObj){
        const book=Book(bookObj);
        return book.remove();
    }

    static deleteBook(bookId,callback){
       return Book.findOne(bookId,callback)

    }
}

module.exports=BookDAO;