console.log('Hi!');


//This just lets one play with account objects by using their names in the console
//until a GUI is made
function updateConsoleVariables(){
  
   
  for (let account of model._accounts) {
    //this refers to window??
    // console.log("window is.....   ",window);
    this[account.name.replace(/\s+/g, '')]=account;
  };
  
  
  // FIND OUT WHY THESE DON'T WORK
  // console.log("To create a NEW ACCOUNT, enter \"createAccount(accountName,openingBalance)\".");
  // console.log("To record a TRANSFER, enter \"transfer(sourceAccount,targetAccount,amount)\".");
  // console.log("To display BALANCES, enter \"displayBalances()\".");
}








//accounts.getLocalData();
//RIGHT NOW AFTER GETTING THE LOCAL DATA, IT DOESN'T "KNOW" THAT THE OBJECTS ARE ACCOUNTS, WITH THE FUNCTIONS THAT COME WITH THEM
//this is because json stringify doesn't keep the methods, or else Json.parse loses them
//MAKE getlocaldata() INCLUDE AN Object.assign() STEP TO MAKE ACCOUNT OBJECTS ACCOUNTS AGAIN
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign


//transactions, right now, doesn't have true account objects in its "target account" and "source account" attributes
//due to json.parse not preserving methods
//SHOULD IT? or is it enough for a transaction just to have the "names" of the targetAccount and sourceAccount?

//updateConsoleVariables();

//view.populate();
//view.setupEventListeners();

// $( document ).ready(function() {
  //everything is enclosed so that it only runs when the page loads
  
  
  
  console.log( "ready!" );
//   getLocalData: function() {

  
  
  let accountList = Store.fetchAccounts();
  let transactionList = Store.fetchTransactions();



  let model = new AccountsModel(accountList,transactionList);
  
  let view = new AccountsView(model,{
    'accountSection': $('.accountSection'),
    'transactionSection': $('.transactionSection'), 
  });

  let controller = new AccountsController(model,view);

  let accountsWithBalances = AccountsController.getAccountsWithBalances(model);
  let accountNames = AccountsController.getAccountNames(model);

  view.rebuildAccounts(accountsWithBalances);
  view.rebuildTransactions(model._transactions);
  view.rebuildLists(accountNames);
  


  updateConsoleVariables();
  console.log('ready for input')


// });


//INCLUDE BELOW IN MODEL
//   setLocalData: function() {
//     localStorage.setItem("accounts",JSON.stringify(accounts.accountList));
//     localStorage.setItem("transactions",JSON.stringify(accounts.transactions));
//   },
