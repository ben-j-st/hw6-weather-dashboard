$(document).ready(function() {


var searchFunction = function() {
    console.log("Search function was run");

    // // variables for search and query
    // var $searchQuery = $("#search")
    // var apiKey = "";
    // var queryURL = "";
    
    // // ajax query
    // $.ajax({
    //     url: queryUrl,
    //     method: "GET",
    // }).then(function(response){

    // })
}

var checkForEnter = function() {
    if ( event.key === "Enter") {
        console.log("enter was pressed")
        searchFunction();
    }
}

$("#search-btn").on("click", searchFunction);
$("#city-search").on("keydown", checkForEnter)
})