'use strict'

// Variable Declaration
var fvt = JSON.parse(localStorage.getItem('fvt'));
var cloneRow = $('#row').clone();

//Default hidden components
$('#error').hide();
$('#error2').hide();

//Event Listeners
$('#search').on("change", verifyIfEmpty);
$('#search').keyup(searchFunction);
$('#btnSearch').on('click', btnSearch)

//Verifying if there is a favorite array in localstorage (and if not, create one)
if (!fvt) {
    var fvtArr = [];

    localStorage.setItem('fvt', JSON.stringify(fvtArr));
}

//Function that calls the Coingecko Api and sets the data in the top 100 table
function apiCall() {
    $('.clone').remove();
    $.ajax({
        method: "GET",
        url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    }).done(function (res) {

        table(res)

        if ($('#search').val() != "") {
            searchFunction();
        } else if (search != "") {
            $('#search').val(search).keyup();
            search = localStorage.setItem("search", "");
        }
    })
}

//Function responsable for building the top  100 table
function table(res) {
    $.each(res, function (index, result) {

        $('#row').hide();
        var rowClone = cloneRow.clone().addClass('clone').attr('data-name', result.name).attr('data-symbol', result.symbol).attr('data-id', result.id);

        $('.redirect', rowClone).attr('onclick', `redirect('${result.id}')`)
        $('.rank', rowClone).text(result.market_cap_rank)
        $('.name', rowClone).text(result.name + " (" + result.symbol.toUpperCase() + ")")
        $('.symbol', rowClone).attr('src', result.image)
        $('.price', rowClone).text(result.current_price + " " + currencySymbol)
        $('.marketcap', rowClone).text(result.market_cap + currencySymbol)
        $('.variation', rowClone).text(result.price_change_percentage_24h.toFixed(2) + "%")
        $('.volume24h', rowClone).text(result.circulating_supply + " (" + result.symbol.toUpperCase() + ")")

        $('.like-btn', rowClone).attr('id', result.id).attr('onclick', 'favorites(this)');

        if (fvt.indexOf(result.id) > -1) {
            $('.like-btn', rowClone).addClass("favorites");
        }

        $('#table').append(rowClone);

        var variation = $('.variation', rowClone).text()

        if (variation.match("^-")) {
            $(".variation", rowClone).css("color", "red");
            $(".variation", rowClone).prepend("🡻 ");
        } else {
            $(".variation", rowClone).css("color", "green");
            $(".variation", rowClone).prepend("🡹 ");
        }
    })
}

//Calling the function to display the table
apiCall();

//Sets the currency and respective symbol with help of an external script to keep it across pages
$('#currencylist li').on('click', function () {

    currencySymbol = $(this).text();
    localStorage.setItem("currencySymbol", JSON.stringify($(this).text()));
    setCurrency();
    apiCall();
})


//Searches a coin in the top 100 table
function searchFunction() {

    $('#error').hide();
    $('#error2').hide();
    var valueToSearch = $('#search').val().toLowerCase();
    var cryptoList = $('#table').find('.clone');

    if ($(cryptoList).length == 0) {
        return apiCall();
    }
    $(cryptoList).show();

    for (var i = 0; i < $(cryptoList).length; i++) {
        var name = $(cryptoList[i]).attr('data-name').toLowerCase();
        var symbol = $(cryptoList[i]).attr('data-symbol').toLowerCase();
        var id = $(cryptoList[i]).attr('data-id').toLowerCase();

        if (!name.includes(valueToSearch) && !symbol.includes(valueToSearch) && !id.includes(valueToSearch)) {
            $(cryptoList[i]).hide();
        }
    }

    if ($('.clone:hidden').length >= 100 && $('#erro:hidden')) {
        $('#error').show();
    }
}

//By clicking the button, this function is called and looks for coins in and outside the top 100
function btnSearch() {

    $('#error').hide();
    var valueToSearch = $('#search').val().toLowerCase();

    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: "https://api.coingecko.com/api/v3/coins/" + valueToSearch,
        error: function () {
            $('#erro').hide();
            $('#erro2').show();
        },
        success: function (result) {

            searchrow(result);
        }
    })
}

//Shows the empty cloned table row when searching a coin not on the top 100 coins
function searchrow(result) {
    $('.clone').remove();
    $('#row').show();

    $('.redirect').attr('onclick', `redirect('${result.id}')`)
    $('.rank').text(result.market_cap_rank)
    $('.name').text(result.name + " (" + result.symbol.toUpperCase() + ")")
    $('.symbol').attr('src', result.image.small)
    $('.price').text(currencySymbol + " " + result.market_data.current_price[currency])
    $('.marketcap').text(result.market_data.market_cap[currency])
    $('.variation').text(result.market_data.price_change_percentage_24h.toFixed(2))
    $('.volume24h').text(result.market_data.circulating_supply)

    $('.like-btn').attr('id', result.id).attr('onclick', 'favorites(this)');

    if (fvt.indexOf(result.id) > -1) {
        $('.like-btn').addClass("favorites");
    }
    var variation = $('.variation').text()

    if (variation.match("^-")) {
        $(".variation").css("color", "red");
        $(".variation").prepend("🡻 ");
    } else {
        $(".variation").css("color", "green");
        $(".variation").prepend("🡹 ");
    }
}

//This function is called when clicking on a table row to redirect to the clicked coin's details page
function redirect(idCoin) {
    window.location.href = "details.html?id=" + idCoin;
}

//Verifies if the search bar is empty
function verifyIfEmpty() {

    if ($('#search').val() == "") {
        apiCall();
    }

}

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

//This set of events hide and shou the table acording to the user preference
$("#top10").on("click", function () {
    $('.clone').hide();
    for (let i = 0; i < 10; i++) {

        $('.clone').eq(i).show();
    }
})

$("#top50").on("click", function () {
    $('.clone').hide();
    for (let i = 0; i < 50; i++) {

        $('.clone').eq(i).show();
    }
})

$("#top100").on("click", function () {
    $('.clone').hide();
    for (let i = 0; i < 100; i++) {

        $('.clone').eq(i).show();
    }
})