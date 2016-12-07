// We write the constants here
var NUMBER_OF_CATEGORY_NAMES = 4;//how many names are in one category
var DATE_OF_DENOMINATION = new Date("2016-07-01");//the date of denomination, the constants

function randomUsd(min, max){
    var minCent = min*100;
    var maxCent = max*100;
    var amount = Math.floor(Math.random()*(maxCent-minCent) + minCent);
    return amount/100;// we work with cents
}

function randomByn(min, max){
    var minByn = min*100;
    var maxByn = max*100;
    var amount =  Math.floor(Math.random()*(maxByn-minByn) + minByn);
    return amount/100; // we work with cents
}

function randomByr(min, max){
    var minByr = min/100;
    var maxByr = max/100;
    var amount = Math.floor(Math.random()*(maxByr - minByr) + minByr);
    return amount*100; // we work with 100 rub minimum

}

function oneDayOfUser(){// we parse all transaction list
    var i = 1, 
    TypeA = [],// TypeA because there is an array of Type
    OperationNameA = [],// 
    AmountMinA = [],
    AmountMaxA = [],
    CurrencyA = [],
    RateA = [],// Rate[2] - is the Rate field of the transaction 2
    PeriodA = [],
    AccountA = [],
    StudentH = {},// this is the hash, {TypeH : TypeA, and so on}
    cursor = db.student.find(),
    length;
    cursor.forEach(
        function(obj){
            TypeA[i] = obj.Type;// we find certain field of the certain transaction
            OperationNameA[i] = obj.OperationName;
            AmountMinA[i] = obj.AmountMin;
            AmountMaxA[i] = obj.AmountMax;
            CurrencyA[i] = obj.Currency;
            RateA[i] = obj.Rate;
            PeriodA[i] = obj.Period;
            AccountA[i] = obj.Account;
                i++; 
        }
    );
    length = i-1;//after last cycle step i=last step+1
    StudentH = {len : length,// StudentH is a hash of transactions and the it has .len
            Type : TypeA ,
            OperationName : OperationNameA,
            AmountMin : AmountMinA,
            AmountMax : AmountMaxA,
            Currency : CurrencyA,
            Rate : RateA,
            Period : PeriodA,
            Account : AccountA}
 return StudentH;   
}

function standartDate(anyDay){// this function normalize string date into a Date object

    var anyDayA = anyDay.split("/"),// we have got an array of 3 numbers in a string type
    
        anyDATE = new Date();
        anyDATE.setFullYear(anyDayA[2]);// A means Array
        anyDATE.setMonth(anyDayA[1]-1);// we have months in range of 0...11
        anyDATE.setDate(anyDayA[0]);// anyDATE is in a correct format

    
    return anyDATE;

}


function plusWeek(nowDay){// function finds a period in 1 week for a transactions
    var pointOne = standartDate(nowDay)//start day
    var day = (pointOne.getDate());// day of a week in range 0...6

    var pointTwo = pointOne;// we assign pointOne to pointTwo because we gonna use a method setDate()
    var x = pointTwo.setDate(day+10);
    return pointTwo;
}    
   /*print(plusWeek("1/1/2010"));
   /*var now = new Date();*/
  /* print(new Date(2016,12,0).getDate());*/
function RandomAmount(AmountMin, AmountMax, Currency){
    var result ;
    var AmountMin = AmountMin,
        AmountMax = AmountMax,
        Currency = Currency;//we will return a result only, we do not need to return currency
    print("currency= "+Currency);
    switch(Currency){
        case "Usd":
            result = randomUsd(AmountMin, AmountMax);break;
        
        case "Byr":
            result = randomByr(AmountMin, AmountMax);break;
        
        case "Byn":
            result = randomByn(AmountMin, AmountMax);break;
        
    }
    return result;
}//RandomAmount returns random result 

function WriteTransaction(Date, Type, Category, Name, Amount, Currency, Account){
    //Date is in standart format
    db.transactions.insert({"Date": Date, "Type": Type, "Category": Category, "Name": Name,
                           "Amount": Amount, "Currency": Currency, "Account": Account});
}// we insert document into the collection

function makeMonthlyTransactions(start_Day, finish_Day, Month, Year){// we check the list of transactions and if we have a monthly one we generate a random day and make a transaction
    //there are arrays typeA[1]...typeA[length] - for every transaction
    // if we have a full month then start_Day is 1 and if we have the first month we use the start_Day
    
    for(i=1; i<oneDayOfUser().len+1; i++){// we check the transaction list
        print("i="+i);
        print("oneDayOfUser().Period[i] = "+ oneDayOfUser().Period[i]);
        print("oneDayOfUser().Rate[i] = "+ oneDayOfUser().Rate[i]);
        if(
            (oneDayOfUser().Period[i] === "Month") && 
            (oneDayOfUser().Rate[i] === 1)){
        
            var transactionDay = Math.floor(Math.random()*(finish_Day - start_Day) + start_Day);
            var transaction_Date = new Date();// we convert it into an object format
            transaction_Date.setFullYear(Year);
            transaction_Date.setMonth(Month);
            transaction_Date.setDate(transactionDay);
            print("@@Full transaction date is"+transaction_Date);
            var transactionAmount = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount 
            // make a monthly transaction, we need to call random day
            var Number_of_the_name_of_transaction = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            // Math.random()<1 that`s why name_of_transactions<NUMBER_OF_CATEGORY_NAMES
            var operationName =  oneDayOfUser().OperationName[i]
            var transactionNameH = db.names.find({"transaction":oneDayOfUser().OperationName[i]},{"names":1,_id:0}).toArray();
            // we have an object from the cursor with transactions names of the operation
            print("transactionName array - " + transactionNameH[0].names);
            var transactionNameOnly = transactionNameH[0].names[Number_of_the_name_of_transaction];
            print("name of any transaction = "+ transactionNameOnly);
            var transactionType = oneDayOfUser().Type[i];
            var transactionCurrency = oneDayOfUser().Currency[i];
            var transactionAccount = oneDayOfUser().Account[i];
            /*=============================*/
            // we have
            // transactionNameOnly - the name of the transaction
            // operationName - the name of operation the category of transaction
            // transactionDay - the day of the transaction
            // Month, Year - from the arguments of the function
            // Question - have I make the variables like var Month = Month?
            // transactionType - the type of the transaction
            // transactionAmount - the amount of the transaction
            // transactionCurrency - the currency of the transaction
            // transactionAccount - the account for the transaction

            
            if(transaction_Date >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date,transactionType, operationName, transactionNameOnly, 
                             transactionAmount, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date,transactionType, operationName, transactionNameOnly, 
                             transactionAmount, transactionCurrency, transactionAccount)
                }
            }
            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it
        }
    }
}

function runMonthlyOne(startDate, finishDate){// global function runs transaction generation
    var startDATE = standartDate(startDate);
    print("##startDATE-"+startDATE);
    
    finishDATE = standartDate(finishDate);//standart Data objects
    var start_Day = startDATE.getDate();
    print("##start_Day - "+ start_Day);
    var start_Month = startDATE.getMonth();// month is in range 0...11
    print("##start_Month - "+start_Month);
    var start_Year = startDATE.getFullYear();
    print("##start_Year - "+start_Year);

    var max_day_month = new  Date(start_Year, start_Month+1, 0).getDate();// how many days in month
    print("##max_day_month - "+max_day_month);

    var last_Day = max_day_month; // for the first month
        
    makeMonthlyTransactions(start_Day, last_Day, start_Month, start_Year);// we call this function
    //to make all monthly transactions for the first month

       
        var zDATE = new Date(start_Year, start_Month, last_Day);
        zDATE.setDate(zDATE.getDate()+1);
        print("### 1 now NOW DATE = "+zDATE);// 1-st February

var cycleDATEstart,
    cycleDATEfinish,
    cycle_day_in_month,
    cycleDay,
    cycleMonth,
    cycleYear,
    bufferDay,
    bufferMonth,
    bufferYear;
do{
    cycleDATEstart = zDATE;// first day of month
    print("##cycleDATEstart - " + cycleDATEstart);
    cycleDayFirst = zDATE.getDate();
    print("cycleDay - " + cycleDayFirst);
    cycleMonth = zDATE.getMonth();
    print("cycleMonth - " + cycleMonth);//february = 1
    cycleYear = zDATE.getFullYear();
    print("cycleYear - " + cycleYear);
    cycle_day_in_month = new Date(cycleYear, cycleMonth+1,0).getDate();//how many days in month - OK
    print("##cycle_day_in_month - " + cycle_day_in_month);

    bufferDay = cycleDATEstart.getDate();
    bufferMonth = cycleDATEstart.getMonth();
    bufferYear = cycleDATEstart.getFullYear();
    
    cycleDATEfinish = new Date(bufferYear, bufferMonth, bufferDay);//just now we have a clone
    cycleDATEfinish.setDate(cycleDATEfinish.getDate()+cycle_day_in_month-1);
    print("##cycleDATEfinish - " + cycleDATEfinish);
    
    makeMonthlyTransactions(cycleDayFirst, cycle_day_in_month, cycleMonth, cycleYear);//Define please what is the start day and the finish day!
    // We don`t care now about the last short month - we will check it later
    
    bufferDay = cycleDATEfinish.getDate();
    bufferMonth = cycleDATEfinish.getMonth();
    bufferYear = cycleDATEfinish.getFullYear();
    
    zDATE = new Date(bufferYear, bufferMonth, bufferDay);//just now we have a clone 
    zDATE.setDate(cycleDATEfinish.getDate()+1);
    print("##zDATE = cycleDATEfinish+1 = "+zDATE);
    print("$$cycleDATEfinish - "+cycleDATEfinish);
    print("$$finishDATE - "+finishDATE);
}while(cycleDATEfinish < finishDATE);


   


        
        
        


}

runMonthlyOne("1/1/2010", "25/11/2010");//start date and final date - in my task 2016

