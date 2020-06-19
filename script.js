$(document).ready(function() {

    // global variable 
    var apiKey = "4ba5d08bcf1bec42005bd0e793d11aac";

    var month = moment().format('MMMM Do');
    // var dayNum = parseInt(moment().format('D'));
    // console.log(dayNum);
    

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


        //clear main weather and 5 day forecast
        $("#main-weather").empty();
        $("#five-day").empty();

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
        
      
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="  + $city + "&units=metric&appid=" + apiKey;
        
        // ajax query
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            
            

            //calling function to create fields for data
            mainWeatherDisplay(response);
            
            // function for making a second call to ajax to get day forecast using lat and lon from first ajax call
            fiveDayDisplay(response);


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
        // console.log(response)

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
            text: "City: " + cityName + ", " + country + " - " + month 
        })

        var $temp = $("<p>", {
            id: "temp",
            html: "Temperature: " + temp + '&#8451;',
        })

        var $humidity = $("<p>", {
            id: "humidity",
            text: "Humidity: " + humidity + "%",
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

    var fiveDayDisplay = function(response) {

        // gets lat and lon from response(first ajax call via city name)
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var fiveDayURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + lon + "&exclude=current,minutely,hourly&units=metric&appid=" + apiKey;
        

        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function(response) {
            console.log("this is fivedayURL response");
            console.log(response);

            // create variable for uvi index
            var $uvi = $("<p>", {
                id: "uvi-index",
                text: "UVI: " + response.daily[0].uvi
            })
    
            $("#main-weather").append($uvi)


            
            var dailyArray = response.daily;
            $("#five-day").append($("<h3>", {
                text: "5-Day Forecast"
            }))
            var $newRow = $("<div>", {
                class: "row",
                id: "five-day-row",
            }) 
            $("#five-day").append($newRow)

            for (var i =0; i < 5; i++) {
                var changingDay = moment().add((i+1),"days").format('MMMM Do')
                console.log(changingDay)
                var $newDiv = $("<div>", {
                    class: "col-2",
                    id: "day-" + (i+1)
                })

                var $heading = $("<h5>", {
                    text: changingDay,
                })

                var $dayTemp = $("<p>", {
                    html: "Temprature: " + dailyArray[(i+1)].temp.day +  '&#8451;',
                }) 

                var $dayHum = $("<p>", {
                    text: "Humidity: "+ dailyArray[(i+1)].humidity + "%",
                })

                $newRow.append($newDiv)
                $newDiv.append($heading, $dayTemp, $dayHum)
            }
           
        })

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