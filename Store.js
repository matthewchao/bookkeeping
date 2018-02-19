function Store() {}


Store.fetchAccounts = function() {
  let accountList = [];
  
  if (localStorage.getItem("accounts")) { //() checks whether it exists in storage. if it doesn't, null => false
      
    console.log("Drew accounts from local storage...")
    accountList = JSON.parse(localStorage.getItem("accounts"));
    for (let account of accountList){
      //turn objects into account objects first
      account.__proto__ = Account.prototype
    };
  
  
  };
  
  return accountList;
  
}



Store.fetchTransactions = function() {
  let transactionList=[];
  if (localStorage.getItem("transactions")) {
    transactionList = JSON.parse(localStorage.getItem("transactions"));
    for (let transaction of transactionList){
      //this ensures that transaction and transaction.accounts are really transaction and account objects
      transaction.__proto__ = Transaction.prototype;
    };
    console.log("Drew transactions from local storage...")
  } else {
    console.log("Drawing up transactions from scratch");
  }
  
  return transactionList;

}


Store.setAccounts = function(accounts) {
  
  localStorage.setItem("accounts",JSON.stringify(accounts));

}


Store.setTransactions = function(transactions) {
  
  localStorage.setItem("transactions",JSON.stringify(transactions));

}


Store.addAccount = function(account) {
  
  let accounts = this.fetchAccounts();
  
  accounts.push(account);
  
  this.setAccounts(accounts);

}



Store.deleteAccount = function(accountToDelete) {

  let accounts = this.fetchAccounts();
  console.log('gotten accounts:   ', accounts);
  console.log('account to delete:   ',accountToDelete);
  
  accounts = accounts.filter(account => !Account.compare(account,accountToDelete));
  
  console.log('accounts after deletion is... ',accounts);
  this.setAccounts(accounts);
}



Store.addTransaction = function(transaction) {
  
  let transactions = this.fetchTransactions();
  
  transactions.push(transaction);
  
  Store.setTransactions(transactions);
  console.log('777777777777777 storage set new transactions:   ',transactions);
}
  

Store.deleteTransactions = function(transactionsToDelete) {

  let transactions = this.fetchTransactions();
  
  
  
  // console.log('STORE HERE: transactions to delete are:     ');
  // console.log(transactionsToDelete);
  // console.log('STORE HERE: transactions before filtering are:   ');
  // console.log(transactions);
    
  //can't use built in notion of equality:    
  //keep only transactions which don't belong to transactionsToDelete
  transactions = transactions.filter(transaction => {
    //keep transaction if it "equals" none of the unwanted
    return transactionsToDelete.every(unwanted => {
      return !Transaction.compare(unwanted,transaction)
    });
  })
  // console.log('STORE HERE: leftover transactions are');
  // console.log(transactions);

  Store.setTransactions(transactions);

}
  
  




