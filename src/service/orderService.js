const Order =require('../Model/Orders')
class OrderService{
    static getOrder(bookId,callback){
           Order.findOne(bookId,callback);
    }
    static save(orderObj){
        const order = new Order(orderObj);
        return order.save();
    }
    static userOrders(userId){
        return Order.find(userId)
    }
    static allOrders(){
        return Order.find()
    }
    static async getOrders(bookId,userId){
        return Order.findOne({ $and: [{ userId: userId }, { bookId: bookId }] })

    }
  
}

module.exports=OrderService;