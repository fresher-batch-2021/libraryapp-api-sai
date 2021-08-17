const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: "book"
    },
    orderDate:{
        type:String,
        default:Date
    },
    dueDate:{
        type:String,
        default:0
    },
    returnDate:{
        type:String,
        default:0
    },
    fine:{
        type:String,
        default:0
    },
    status:{
        type:String,
        default:"ordered"
    }
},{timestamps:true});

module.exports = Order = mongoose.model('order', OrderSchema);