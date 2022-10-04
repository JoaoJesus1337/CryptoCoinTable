'use strict'

// Variable Declaration
var fvt = JSON.parse(localStorage.getItem('fvt'));
var cloneRow = $("#row").clone();
var ids = fvt.join();

//Default hidden components
$('#row').hide();
$('#error').hide()


//Checks if there is a favourite array and, if not creates that array
if (!fvt) {
    var fvtArr = [];

    localStorage.setItem('fvt', JSON.stringify(fvtArr));
}

//Function that calls the Coingecko Api and sets the data in the favorites table
function apiCall() {
    $('.clone').remove();

    $('#error').hide();
    $.ajax({
        method: "GET",
        url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
        
        error: function () {
            $('#error').show()
        },
        success: function (res) {

            if(fvt.length == 0)
            {
                $('#error').show()
            }            
            tableBuilder(res) 
        }
    })


}

//Executes the api call to show coins added to the favorites
apiCall();

//This function grabs the results from Ajax and builds the table acording to the data
function tableBuilder(res)
{
    $.each(res, function (index, result) {


        $('#row').hide();
        var rowClone = cloneRow.clone().addClass("clone");
        if (fvt.indexOf(result.id) > -1) {

            $('.redirect', rowClone).attr('onclick', `redirect('${result.id}')`)
            $('.rank', rowClone).text(result.market_cap_rank)
            $('.name', rowClone).text(result.name + " (" + result.symbol.toUpperCase() + ")")
            $('.symbol', rowClone).attr('src', result.image)
            $('.price', rowClone).text(result.current_price + " " + currencySymbol)
            $('.marketcap', rowClone).text(result.market_cap + currencySymbol)
            $('.variation', rowClone).text(result.price_change_percentage_24h.toFixed(2) + "%")
            $('.volume24h', rowClone).text(result.circulating_supply + " (" + result.symbol.toUpperCase() + ")")

            $('.like-btn', rowClone).attr('id', result.id).attr('onclick', 'favorites(this)').addClass("favorites");

            $('#table').append(rowClone);

            var variation = $('.variation', rowClone).text()

            if (variation.match("^-")) {
                $(".variation", rowClone).css("color", "red");
                $(".variation", rowClone).prepend("🡻 ");
            } else {
                $(".variation", rowClone).css("color", "green");
                $(".variation", rowClone).prepend("🡹 ");
            }
        }
    })
}

//Sets the currency and respective symbol with help of an external script to keep it across pages
$('#currencylist li').on('click', function () {

    currencySymbol = $(this).text();
    localStorage.setItem("currencySymbol", JSON.stringify($(this).text()));
    setCurrency();
    apiCall();
})

//When searching, this function stores the search query in an external variable and redirects to index.html where it runs the respective search function
$('#btnSearch').on('click', function redirectIndex() {

    var valTosearch = $('#search').val().toLowerCase();

    search = localStorage.setItem("search", valTosearch);
    console.log(search);
    window.location.href = "index.html";
})


//This function is called when clicking on a table row to redirect to the clicked coin's details page
function redirect(idCoin) {
    window.location.href = "details.html?id=" + idCoin;
}


//This function removes a coin from the favorites by clicking the button
function favorites(moeda) {
    $(moeda).toggleClass("favorites")

    fvt.splice(fvt.indexOf($(moeda).attr("id")), 1)
    $(moeda).parents()[1].remove();
    localStorage.setItem('fvt', JSON.stringify(fvt));

    if (fvt.join() == "") {
        $('#error').show();
    }
}