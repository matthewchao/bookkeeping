KNOWN ISSUES:
-It should be fixed with Grid.

TO REFACTOR:
- view.rebuildLists should be DRYed up by looping through all <select> elements and filling with existing accounts
- view.rebuildAccounts should be dones with a template literal string of html,
as rebuildTransactions was done;


MODEL SPECS

- It should be able to get all transactions associated with a given account, and a running balance NOTDONE
- It should allow deletions of transfers, which reflect in the history CHECK
- It should allow split transfers: multiple source accounts to multiple target accounts NOTDONE
-Transactions should have a date attribute in addition to a dateEntered one



VISUAL SPECS:
- It should display all accounts with their current balances in a box DONE
- It should display all transactions DONE
- show/hide a delete button when an account has focus: https://www.w3schools.com/jquery/event_blur.asp
- It should have an add Acount with opening Balance feature DONE
- When a transaction is entered, the accounts should be updated DONE
- When an account is clicked, it should show the relevant transactions in another box
- It should use css-grid to organize things NOT DONE
