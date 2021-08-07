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
    returnDate:{
        type:String,
        default:null
    },
    fine:{
        type:String,
        default:0
    }
},{timestamps:true});

module.exports = Order = mongoose.model('order', OrderSchema);