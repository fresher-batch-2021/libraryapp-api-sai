const PER_DAY_FINE = 10;
const NO_OF_DAYS  = 7;
const NO_OF_DAYS_TO_BE_RENEWED = 3;
const dayjs = require('dayjs');

class LibraryService {
    static getFineAmount(dueDate) {
        
        let noOfDays = dayjs().diff(dueDate, 'days');         
        let fine = 0;
        console.log(noOfDays);
         if (noOfDays > 0) { 
            fine = PER_DAY_FINE * noOfDays; 
        }
        console.log(fine)
        return fine;
    }

    static getDueDate() {        
        
        let dueDate = dayjs().add(NO_OF_DAYS, 'days').format('YYYY-MM-DD');
        return dueDate;
    }
    static getDiff(dueDate){
        return dayjs().diff(dueDate,'days')
    }

    static getRenewalDueDate(currentDueDate){
        return dayjs(currentDueDate).add(NO_OF_DAYS_TO_BE_RENEWED, 'days').format('YYYY-MM-DD');
    }
    static addBookQuantity(book){
        book=book+1
        console.log(book)
        return book
    }
   
}
module.exports=LibraryService;