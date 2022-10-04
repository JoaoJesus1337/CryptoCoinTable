'use strict'

// Variable Declaration
var url = window.location.search;
var urlParams = new URLSearchParams(url);
var coinId = urlParams.get("id");
var fvt = JSON.parse(localStorage.getItem('fvt'));
var language

language = "en";

//Checks if there is a favourite array and, if not creates that array
if (!fvt) {
    var fvtArr = [];

    localStorage.setItem('fvt', JSON.stringify(fvtArr));
}

//Function that calls the Coingecko Api and sets the data in the details page
function showDetails() {
    $.ajax({
        method: "GET",
        url: `https://api.coingecko.com/api/v3/coins/${coinId}`
    }).done(function (res) {

        detailsPG(res);
    })
}

//Executes the api call to show the details
showDetails();

//Puts the correct information in the respective slot
function detailsPG(res)
{
    $('.coinImg').attr('src', res.image.large)
    $('.rank').text(res.market_cap_rank)
    $('.name').text(res.localization[language] + " (" + res.symbol.toUpperCase() + ")")
    $('.value').text(res.market_data.current_price[currency] + " " + currencySymbol)
    $('.variation24h').text(res.market_data.price_change_percentage_24h.toFixed(2) + "%")
    $('.description').html(res.description[language])

    $('.like-btn').attr('id', res.id).attr('onclick', 'favorites(this)')
    if (fvt.indexOf(res.id) > -1) {
        $('.like-btn').addClass("favorites");
    }
}

//When searching, this function stores the search query in an external variable and redirects to index.html where it runs the respective search function
$('#btnSearch').on('click', function redirectIndex() {
    
    var valTosearch = $('#search').val().toLowerCase();

    search = localStorage.setItem("search", valTosearch);
    window.location.href = "index.html";
})

//This function is called when adding a coin to the favorites toggling the respective class and adding it to the localstorage
function favorites(moeda) {
    $(moeda).toggleClass("favorites")
    if ($(moeda).hasClass("favorites")) {

        fvt.push($(moeda).attr("id"));
    } else {
        fvt.splice(fvt.indexOf($(moeda).attr("id")), 1)
    }
    localStorage.setItem('fvt', JSON.stringify(fvt));
    console.log(fvt)
}

//Sets the currency and respective symbol with help of an external script to keep it across pages
$('#currencylist li').on('click', function () {

    currencySymbol = $(this).text();
    localStorage.setItem("currencySymbol", JSON.stringify($(this).text()));
    setCurrency();
    showDetails();
})

//Sets the language on which the user wants to see the details
$('#languagelist li').on('click', function () {

    language = $(this).text();

    switch (language) {
        case 'English':
            language = 'en';
            break;

        case 'Korean':
            language = 'ko';
            break;
    }
    showDetails();
})