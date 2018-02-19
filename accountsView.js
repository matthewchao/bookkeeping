function AccountsView(model,DOMelements) {
  
  this._model = model;
  this._DOMelements = DOMelements;
  this._transactionMap = new Map();
  
  this.addAccountClicked = new Event(this);
  this.editAccountClicked = new Event(this);
  this.deleteAccountClicked = new Event(this);

  
  this.addTransactionClicked = new Event(this);
  this.editTransactionClicked = new Event(this);
  this.deleteTransactionClicked = new Event(this);
  
  const _this = this;
  
  
  //LISTENERS: THE VIEW LISTENS ONLY TO THE DOM
  //THE CONTROLLER MAY TELL THE VIEW TO DO THINGS, BUT THE VIEW ISN'T LISTENING TO IT OR THE MODEL  
  
  
  //listening to DOM for delete accounts
  const accountBody = document.querySelector(".accountBody");
  
  accountBody.addEventListener('click',function(event){
    //if the input ('x') button was clicked, determine the account name and balance
    //alert asking if they're sure
    let clicked = event.target;
    
    if (clicked.type==="button"){
      
      _this.deleteAccountClicked.notify({    
        name: clicked.parentNode.parentNode.textContent});
    
    };
  
  });
  
  
  
  //listening to DOM for add account
  const addAccountForm = document.getElementById('addAccountForm');
  
  addAccountForm.addEventListener('submit',function(event){
    event.preventDefault();
    
    let nameField = document.querySelector("#newAccount");
    let balanceField = document.querySelector("#newBalance");
    
    _this.addAccountClicked.notify({
      
      accountName: nameField.value.trim(), //the value of the input
      openingBalance: balanceField.value, //the value of the input
      
    });
  
    
  });
  
  
  //listening to DOM for add transaction
  const addTransactionForm = document.getElementById('addTransactionForm');
  
  addTransactionForm.addEventListener('submit', function(event){
    event.preventDefault();

    
//     console.log('1111111111 view received form input:   ')
//     console.log({
      
//       //
//       sourceName: addTransactionForm.elements.sourceAccount.value, //the value of the input
//       targetName: addTransactionForm.elements.targetAccount.value,
//       amount: addTransactionForm.elements.transactionAmount.value, //the value of the input
      
//     });
    
    
    _this.addTransactionClicked.notify({
      
      //
      sourceName: addTransactionForm.elements.sourceAccount.value, //the value of the input
      targetName: addTransactionForm.elements.targetAccount.value,
      amount: addTransactionForm.elements.transactionAmount.value, //the value of the input
      
    });
  
    
  });
  
  
  //listening to DOM for delete transactions
  const transactionBody = document.querySelector(".transactionBody");
  
  transactionBody.addEventListener('click',(event)=>{
    //if the input ('x') button was clicked, determine the account name and balance
    //alert asking if they're sure
    let clicked = event.target;
    
    if (clicked.type==="button"){
    
      // console.log('this inside transactionBody event listener is ....   ',this);
      // console.log('relevant transaction is...   ',this.handleTransactionDelete(clicked))
      
      this.deleteTransactionClicked.notify({
             transaction:     this.handleTransactionDelete(clicked),
             transactionDiv: clicked.parentElement.parentElement.parentElement,
      });
    }
    
  });
  
  
  

  
}









// STATIC METHODS
AccountsView.clearFields = function(...fields) {
    for (let field of fields) {
      
      //if field is a text/number, then set to ''
      //if it is a select, set to option 0
      if (field.nodeName==='SELECT') {
        field.selectedIndex = 0;
      } else {
        field.value = '';
      }
      
      
    }
}  

//for refocusing on the most natural input box after a successful add
AccountsView.refocus = function(form) {
    form.elements[0].focus();
}

//for deleting elements
AccountsView.deleteElement = function(element) {
  element.remove();
}

//transactionMap maps buttons to transactions;






AccountsView.prototype = {
  
  rebuildAccounts: function(accountsWithBalances) {
    console.log("About to rebuild accounts")
    // loop through [account,currentBalance] pairs, and display them in the accountList;
    
    //clear relevant inputs
    const accountField = document.querySelector("#newAccount");
    const balanceField = document.querySelector("#newBalance");

    AccountsView.clearFields(accountField,balanceField);
    
    
    
    
    //first clear all the accounts from the display
    let accountBody = document.querySelector('.accountBody');
    while (accountBody.firstChild) {
      accountBody.removeChild(accountBody.firstChild);
    }

    
    
    
    
    //obtain the container and fill with account names and balances
    // <div id="accountList" class="accountSection">    
    
    for (let accountWithBalance of accountsWithBalances) {
      
      //elements look like this:
      // <div class=" account">
      //   <div class=" name">schwab</div>
      //   <div class=" balance">102</div>
      
      // </div>      
      let accountDiv = document.createElement('div');
      let nameDiv = document.createElement('div');
      let balanceDiv = document.createElement('div');
      let deleteDiv = document.createElement('div');
      let deleteButton = document.createElement('input');

      deleteDiv.appendChild(deleteButton);
      
      
      accountDiv.className += " account";
      nameDiv.className += " name" ;
      balanceDiv.className += " balance" ;
      nameDiv.innerHTML=accountWithBalance[0];
      balanceDiv.innerHTML=accountWithBalance[1];
      deleteDiv.className += " deleteAccount";
      deleteButton.type = "button";
      deleteButton.value = "✕";
      nameDiv.appendChild(deleteDiv);

      
      accountDiv.appendChild(nameDiv);
      accountDiv.appendChild(balanceDiv);
      accountBody.appendChild(accountDiv);  
    
    }
    

  console.log('rebuilt accounts');  

  },
  
  
  
  //refactor this to loop through all lists that have accounts?
  rebuildLists: function(accountNames) {
    
    console.log('about to rebuild drop down lists');
    //clear the options from the first drop-down list
    //then fills with account options
    
    let dropDownList = document.querySelector('select[name="sourceAccount"]');

    while (dropDownList.children[1]) {
      dropDownList.removeChild(dropDownList.children[1]);
    }
    
    for (let name of accountNames) {
      //"this" refers to AccountsView
      let accountOption = document.createElement('option');
      accountOption.value=name;
      accountOption.text=name;
      dropDownList.appendChild(accountOption);
    }
    
    dropDownList = document.querySelector('select[name="targetAccount"]');
    //remove all but the default option
    while (dropDownList.children[1]) {
      dropDownList.removeChild(dropDownList.children[1]);
    }

    for (let name of accountNames) {
      //"this" refers to AccountsView
      let accountOption = document.createElement('option');
      accountOption.value=name;
      accountOption.text=name;
      dropDownList.appendChild(accountOption);
    }
  
  },
  
  rebuildTransactions: function(transactions) {
    
    const transactionBody = document.querySelector('.transactionBody');
    //first clear all transactions
    while (transactionBody.firstChild) {
      transactionBody.removeChild(transactionBody.firstChild);
    }
    
    const sourceField = document.querySelector("#sourceAccount");
    const targetField = document.querySelector("#targetAccount");
    const amountField = document.querySelector("#transactionAmount");

    AccountsView.clearFields(sourceField,targetField,amountField);
    
    let html='';
    
    for (let transaction of transactions) {
      
      html= `
          <div class="transaction">
            <div class="transactionNames">
              <div class="sourceName">
                ${transaction.sourceName}
              </div>
              <div class="targetName">
                ${transaction.targetName}
              </div>
            </div>
            <div class="transactionAmount">
              <div>
              ${transaction.amount}
              </div>
              <div class="deleteTransaction">
                
              </div>
            </div>
            
          </div>`;
      
      transactionBody.insertAdjacentHTML('beforeend', html);
      
      
      //attach event listeners for the transaction delete here
      //each listener will remember what "transaction" is because of closures 
      //SEE https://stackoverflow.com/questions/226689/unique-element-id-even-if-element-doesnt-have-one
      
      //Make an <input type="button" value="✕"> with an event listener
      //and append it to the "delete" div
      let deleteDiv = document.querySelector('.transaction:last-child .deleteTransaction');
      let transactionDiv = deleteDiv.parentElement.parentElement;
      let input = document.createElement('input');
      input.type="button";
      input.value="✕"
      // input.addEventListener('click',()=> {
      //   console.log('this in the txnDelete event handler is....   ',this);
      //   console.log('transaction is.....     ',transaction);
      //   this.deleteTransactionClicked.notify({
      //     transaction: transaction,
      //     transactionDiv: transactionDiv,
      //   })
      // })
      
      this._transactionMap.set(input,transaction);
      deleteDiv.appendChild(input);
      
      
    }
  
  },
  
  handleTransactionDelete: function(target) {

  //   looks up which transaction the button corresponds to
    if (this._transactionMap.has(target)){
      // console.log('this inside handletxndelete is...    ',this);
      // console.log(target,"   was found in the transactionMap, and is associated with    ",this._transactionMap.get(target));
      return this._transactionMap.get(target);
    } else {
      console.log('target was NOT in map for some reason');
    }
  },
  
  
    
  
  
  ////// should these be made static?
  warn: function(warningMessage) {
    alert(warningMessage);
  },
  
  confirmAction: function(warningQuestion) {
    
    //This didn't work without "return"
    return confirm(warningQuestion);
  },  

}