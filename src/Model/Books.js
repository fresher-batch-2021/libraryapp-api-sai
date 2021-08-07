const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    bookName: { type: String, required: true },
    authorName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image:{type:String,required:true},
    createdby: { type: Schema.Types.ObjectId, ref: "user" }
})
module.exports = Book = mongoose.model('book', BookSchema)
