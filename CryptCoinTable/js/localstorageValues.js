'use strict'

// Variable Declaration
var search = localStorage.getItem("search");
var currencySymbol = "€";
var currency;

//Sets the search parameter across pages to empty in case it doesn't exist
if(!search)
{
    search = "";
}

setCurrency();

//Function that sets the currency acording to the symbol clicked
function setCurrency(){
   
    switch (currencySymbol) {

        case "€":
            currency = "eur";
            break;
        case "$":
            currency = "usd";
            break;
        case "£":
            currency = "gbp";
            break;
        case "¥":
            currency = "jpy";
            break;
    }
}