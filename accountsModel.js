function AccountsModel(accounts,transactions) {
  
  this._accounts = accounts;
  
  this._transactions = transactions;
  
  
  
  this.accountAdded = new Event(this);
  
  this.accountDeleted = new Event(this);
  
  this.transactionAdded = new Event(this);
  
  this.transactionsDeleted = new Event(this);
  
  this.transactionDeleted = new Event(this);
  
  
}



//STATIC METHODS:   see https://javascript.info/class#static-methods
AccountsModel.belongsToTransaction = function(account,transaction) { 
   if (transaction.targetName === account.name || transaction.sourceName === account.name) {
        return true;
    } else {
        return false;
    };
}



  
  
  
  
AccountsModel.prototype = {
  
  addAccount: function(name,openingBalance) {
    
    let account = new Account(name,openingBalance);
    this._accounts.push(account);
    
    this.accountAdded.notify({
      account: account,
    });
    
  },
  
  deleteAccount: function(account) {
    
    this._accounts=this._accounts.filter(element => !Account.compare(element,account));
        
    this.accountDeleted.notify({
      account: account,
    })  
  },
  
  
  wipeTransactions: function(account) {
  
    //deletedTransactions is all transactions involving account;
    const deletedTransactions = this._transactions.filter(transaction => AccountsModel.belongsToTransaction(account,transaction));
    // console.log('dddddddddddddddd MODEL is going to delete:    ');
    // console.log(deletedTransactions);
    
    
    //Takes the set difference: (current transactions)\(deletedTransactions)
    //Note this is ok because we took a subarray; so the built in equality operator between objects works
    this._transactions=this._transactions.filter(element => deletedTransactions.indexOf(element) < 0);
    // console.log('ddddddddddct MODEL has deleted, and these remain:    ');
    // console.log(this._transactions);
    
    
    this.transactionsDeleted.notify({
      transactions: deletedTransactions,
    });
    
    
  
  },
  
  
  addTransaction: function(sourceName,targetName,amount) {
    
    let transaction = new Transaction(sourceName,targetName,amount);
    this._transactions.push(transaction);
    // console.log('44444444444   model added transaction')
    this.transactionAdded.notify({
      transaction: transaction,
    });
    
  },
  
  
  
  deleteTransaction: function(transaction) {
    
    this._transactions=this._transactions.filter(element => !Transaction.compare(element,transaction));
        
    this.transactionDeleted.notify({
      transaction: transaction,
    });
    
    // console.log('model just deleted.....    ',transaction);
  },  
    
  
  
  getBalance: function(account) {
        
    let runningBalance = account.openingBalance;
    // console.log("this inside getBalance is   ",this)
    // console.log("this's constructor is    ",this.constructor)
    for (let transaction of this._transactions) {
      if (AccountsModel.belongsToTransaction(account,transaction)) {
          runningBalance += (transaction.targetName===account.name ? transaction.amount : (-transaction.amount));
      }
    }
    
    return runningBalance;
    
  },
    
  
  

};





















function Account(name,openingBalance) { //the prototypical account
  
  this.name = name; // Default value of properties
  this.openingBalance=openingBalance;
  
};


Account.compare = function(account1,account2) {
  return account1.name===account2.name &&
    account1.openingBalance==account2.openingBalance;
}




function Transaction(sourceName,targetName,amount) {


  //if amount is negative, switch the order and assume it is positive
  if (amount<0){
    sourceName=[targetName,targetName=sourceName][0] //this is a one-liner switching
  };
  
  
  
  this.sourceName=sourceName;
  this.targetName=targetName;
  this.amount=Math.abs(amount);
  
  this.dateEntered=(new Date()).toUTCString();
  //ATTRIBUTE FOR DATE OF TRANSACTION TO BE ADDED LATER
    
  
};

Transaction.compare = function(transaction1,transaction2) {
  
  let keys = Object.getOwnPropertyNames(new Transaction());
  
  
  // console.log('transaction keys to check:   ');
  // console.log(keys);
  return keys.every(key => transaction1[key]===transaction2[key])
}