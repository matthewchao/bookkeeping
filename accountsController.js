function AccountsController(model,view) {
  
  this._model = model;
  
  this._view = view;
  
  let _this = this; //the controller
  
 
  //LISTENING TO THE VIEW
  this._view.addAccountClicked.attach(function (sender, args) {
    //where args is an object like
    //     {
    //       accountName: nameField.value, //the value of the input
    //       openingBalance: balanceField.value, //the value of the input
    //     }

    let accountName = args.accountName;
    let openingBalance = args.openingBalance;
        
    if (accountName === '' || openingBalance ==='') {
      _this._view.warn("Empty inputs not allowed");
    }
    // else if (/\W/.test(accountName))
    //   _this._view.warn("only word characters please");
    else if (_this._model._accounts.map(account => account.name).includes(accountName)) {      
      _this._view.warn("account name already in use");
    } else {
      _this.addAccount(accountName,parseFloat(openingBalance));
    }
    // console.log("sender",sender);
    // console.log(args);
  });

  
  
  //MORE LISTENING TO THE VIEW
  this._view.deleteAccountClicked.attach(function (sender,args) {
    
//     where args is an object like below, and sender is the view    
//     {    
//         name: accountNameAsString});
//     }
    if(_this._view.confirmAction(`Are you sure you want to delete ${args.name}? This will also delete all transactions associated with that account!`)) {
      let account = AccountsController.getAccountsByName(_this._model,args.name)[0];
      console.log('bbbbbbbbbbbbb CONTROLLER heard from view that delete was clicked and is readying to delete:    ')
      console.log(account);
      _this.deleteAccount(account);
    
    } else {
      console.log('not confirmed - action not completed');
    }
    
  
  });
  
  
  
  //MORE LISTENING TO THE VIEW:
  this._view.addTransactionClicked.attach(function (sender,args) {
    //where args is an object like
//     {
      
//       sourceName: addTransactionForm.elements.sourceAccount.value, //the value of the input
//       targetName: addTransactionForm.elements.targetAccount.value,
//       amount: addTransactionForm.elements.transactionAmount.value, //the value of the input
      
//     }
    
    //do some validation here; nonempty names; source/target same; etc.
     
    
    console.log('22222222 controller saw view; working with  ',args.sourceName,args.targetName,args.amount);
    let amount = parseFloat(args.amount);
    if (args.sourceName===args.targetName) {
      _this._view.warn("Target and source can't be the same");
    } else if (amount===0) {
      _this._view.warn("Transaction amount can't be zero");
    } else {
      //get accounts by account name and add
      _this.addTransaction(args.sourceName,args.targetName,amount);
    }
    
  
  });
  
  
  //MORE LISTENING TO THE VIEW:
  this._view.deleteTransactionClicked.attach(function (sender,args) {
    //args is an object like
    // {
    //       transaction: transaction,
    //       transactionDiv: transactionDiv,
    //     }
    //sender is the view
    
    const transaction = args.transaction;
    if(_this._view.confirmAction(`Are you sure you want to delete this transaction? This will change the balances of ${transaction.sourceName} and ${transaction.targetName}!`)) {
      
      let account = AccountsController.getAccountsByName(_this._model,args.name)[0];
      _this.deleteTransaction(transaction);
      
      AccountsView.deleteElement(args.transactionDiv);
    
    } else {
      console.log('not confirmed - delete transaction not completed');
    }
    
  });
  
  
  
  
  //LISTENING TO THE MODEL:
  this._model.accountAdded.attach(function (sender, args) {
    //where args is an object like
    // {
    //   account: account,
    // }
    
    //sender was the model

    //this was.... the event??
    // console.log("this inside accountAdded.attach is.....   ",this);
    
    Store.addAccount(args.account);
    
    
    _this._view.rebuildAccounts(AccountsController.getAccountsWithBalances(_this._model));
    
    _this._view.rebuildLists(AccountsController.getAccountNames(_this._model));

  
  });
  
  
  //MORE LISTENING TO THE MODEL:
  this._model.transactionAdded.attach(function (sender, args) {
    //where args is an object like
    // {
    //   transaction: transaction,
    // }
    //sender is the model
    
    console.log('555555555  controller saw that model added transaction between....    ');
    console.log(AccountsController.getAccountsByName(_this._model, args.transaction.sourceName,args.transaction.targetName));
    console.log('555555555  and tells view to rebuild accounts and transactions')
    _this._view.rebuildAccounts(AccountsController.getAccountsWithBalances(_this._model));
    _this._view.rebuildTransactions(_this._model._transactions);
    
    console.log('666666666  and tells local storage to add the transaction');
    Store.addTransaction(args.transaction);    
  
  });
  
  
  //MORE LISTENING TO THE MODEL
  this._model.transactionsDeleted.attach(function(sender,args) {
    
    //args is an object like
    // {
    //   transactions: deletedTransactions, //an array of transaction objects
    // }
    
    console.log('eeeeeeeeeeeeeeeee CONTROLLER heard about transactions deletion');
    
    console.log('and will tell the view to rebuild transactions');
    _this._view.rebuildTransactions(_this._model._transactions);
    _this._view.rebuildAccounts(AccountsController.getAccountsWithBalances(_this._model));

    console.log('fffffffffffffffff CONTROLLER tells the store to remove those transactions');
    Store.deleteTransactions(args.transactions);   

    
  });
  
  this._model.transactionDeleted.attach(function(sender,args) {
    
    //args is an object like
    // {
    //   transaction: deletedTransaction
    // }
        
    _this._view.rebuildAccounts(AccountsController.getAccountsWithBalances(_this._model));

    Store.deleteTransactions([args.transaction]);   

    
  });

  
  
  
  //MORE LISTENING TO THE MODEL:
  this._model.accountDeleted.attach(function(sender,args) {
    
    //args is an object like
    // {
    //   account: account,
    // }
    
    console.log('controller heard about account deletion');  
    _this._view.rebuildAccounts(AccountsController.getAccountsWithBalances(_this._model));
    _this._view.rebuildLists(AccountsController.getAccountNames(_this._model));
    
    Store.deleteAccount(args.account);
  });
  
  
  
  
}


//STATIC FUNCTIONS

//this takes a model, account names separated by quotes, and
//gives a list of the account objects they correspond to
AccountsController.getAccountsByName = function(model,...accountNames) {
  let arr=[];
  for (let name of accountNames) {
      
      arr.push(model._accounts.find(account => (account.name===name)));  
      
  }
  return arr;
};

//this takes a model and returns a list of [accountName,currentBalance] pairs
AccountsController.getAccountsWithBalances = function(model) {
  
  return model._accounts.map(account=> [account.name,model.getBalance(account)]);

}

//this takes a model and returns a list of account names
AccountsController.getAccountNames = function(model){
  return model._accounts.map(account=>account.name);
}
                                         
                                         
                                         

////////PROTOTYPE FUNCTIONS
AccountsController.prototype = {
  
  addAccount: function(accountName,openingBalance) {

    AccountsView.refocus(document.getElementById('addAccountForm'));
    
    
    this._model.addAccount(accountName,openingBalance);
        
  },
  
  deleteAccount: function(account) {
    
    console.log('ccccccccc controller is telling model to wipe all transactions associated with:    ');
    console.log(account);
    
    this._model.wipeTransactions(account);
    
    
    console.log('ffffffffff now CONTROLLER is telling model to delete the account');
    this._model.deleteAccount(account);
    
  },
  
  
  addTransaction: function(sourceName,targetName,amount) {
    
    
    AccountsView.refocus(addTransactionForm);
    console.log('333333333  controller ordered model to add transaction with    ',sourceName,targetName,'and amount:   ');
    console.log(amount);
    
    this._model.addTransaction(sourceName,targetName,amount);
  },
  
  
  
  deleteTransaction: function(transaction) {
    
    this._model.deleteTransaction(transaction);
    
  
  }
  
  
  
}
