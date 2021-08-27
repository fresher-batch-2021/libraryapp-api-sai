const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    bookName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    count:{
        type:Number,
        default:1
    },
    requestedDate:{
        type:String,
        default:Date
    }
})
module.exports = Request_book = mongoose.model('request', RequestSchema);