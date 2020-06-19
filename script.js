$(document).ready(function() {

    var warningFunction = function() {
        // flash right/wrong feedback on page for half a second
        var $warning = $("#warning")
        $warning.attr("class", "text");
        setTimeout(function() {
            console.log("warning issued")
        $warning.attr("class", "text hide");
        }, 1000);
    }

    // function for storing how to creat and populate search container 
    var createSearch = function() {

         // variable for storing the value of the second, second value for trimming.
        var $citySearch = $("#city-search"); 
        var trimSearch = $citySearch.val().trim()

        if ($citySearch.val() === "") {
            warningFunction();
            return
        } else {

        // $citySearch = $("#city-search"); 
        // trimSearch = $citySearch.val().trim()
        console.log(trimSearch)
    
        // create a new div and fill it with text from search
        var $newDiv = $("<div>", {
            class: "search-contents",
            text: trimSearch,
        });
    
        // newdiv css
        $($newDiv).css({
            border: "black solid 1px",
            padding: "10px",
        })
    
        // append the new div
        $("#search-container").prepend($newDiv)


        // run logWeatherFunction
        searchWeather();

        $($citySearch).val("")
        }
    }

    var clearSearches = function() {
        $("#search-container").empty()
    }

    var searchWeather = function() {
        console.log("Search function was run");

        // variable for storing the value and trimming it.
        var $city = $("#city-search").val().trim()
        
        var apiKey = "4ba5d08bcf1bec42005bd0e793d11aac";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="  + $city + "&units=metric&appid=" + apiKey;
        
        // ajax query
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            
            

            //calling function to create fields for data
            mainWeatherDisplay(response)

        })

        // used to empty the field after input 
        
    }

    var checkForEnter = function() {
        if ( event.key === "Enter") {
            console.log("enter was pressed")
            createSearch()
        }
    }

    var mainWeatherDisplay = function(response) {
        console.log(response)

        var cityName = response.name;
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var country = response.sys.country

        // recreate this
        // <h3 id="city-name"> Test City Name:</h3>
        // <p id="temp">Test Temp :</p>
        // <p id="humidity">Test Humidity: </p>
        // <p id="us-index">Test UV Index: </p>
        var $cityName = $("<h3>", {
            id: "city-name",
            text: "City Name: " + cityName + ", " + country 
        })

        var $temp = $("<p>", {
            id: "temp",
            html: "Temperature: " + temp + '&#8451;',
        })

        var $humidity = $("<p>", {
            id: "humidity",
            text: "Humidity: " + humidity,
        })

        $("#main-weather").append($cityName, $temp, $humidity);

        // add this styling
        var $mainWeather = $("#main-weather");

        $mainWeather.css({
            "margin-top": "5px",
            "margin-bottom": "5px",
            padding: "10px",
            border: "1px solid black",
            "border-radius": "5px",

        })
        //recreate this styling 
        // #main-weather {
        //     margin-top: 5px;
        //     margin-bottom: 5px;
        //     padding: 10px;
        //     border: solid 1px black;
        //     border-radius: 5px;
        // }
        
    }

    var fiveDayDisplay = function() {



        //  recreate this  
        // <!-- 5 Day Forcast -->
        // <h3>Five Day Forecast: </h3>

        // <div class="row">
        //     <div class="col-2" id="day-1">
        //         <h5>Stuff 1:</h5>
        //     </div>
        //     <div class="col-2" id="day-2">
        //         <h5>Stuff 2:</h5>
        //     </div>
        //     <div class="col-2" id="day-3">
        //         <h5>Stuff 3:</h5>
        //     </div>
        //     <div class="col-2" id="day-4">
        //         <h5>Stuff 4:</h5>
        //     </div>
        //     <div class="col-2" id="day-5">
        //         <h5>Stuff 5:</h5>
        //     </div>
        // </div>
    }

    $("#search-btn").on("click", createSearch);
    $("#city-search").on("keydown", checkForEnter);
    $("#clearBtn").on("click", clearSearches);
})