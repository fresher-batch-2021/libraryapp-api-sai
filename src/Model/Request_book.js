const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    bookName: {
        type: String,
        required: true
    },
    requestedDate:{
        type:String,
        default:Date
    },
    requestedUsers:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }]
})
module.exports = Request_book = mongoose.model('request', RequestSchema);