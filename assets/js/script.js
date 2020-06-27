$(document).ready(function() {

    // global variable 
    var apiKey = "4ba5d08bcf1bec42005bd0e793d11aac";
    var $redoSearch = "";
    var gifWeather = "";
    var gifURL = "";

    //variable for storing Search History
    var lastCitySearched = "";

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
        // console.log(trimSearch)
    
        // create a new div and fill it with text from search
        var $newDiv = $("<div>", {
            class: "search-contents",
            text: trimSearch,
        });
    
        // newdiv css
        $($newDiv).css({
            border: "white solid 1px",
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

        // variable for storing the value and trimming it.
        var $city = $("#city-search").val().trim()
        
        // used to make lastCitySearched equal to watcher was last searched
        lastCitySearched = $city;
        // save lastCitySearched to local storage
        saveSearchFunction()

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="  + $city + "&units=metric&appid=" + apiKey;
        
        // ajax query
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            
            gifWeather = response.weather[0].description

            displayGif();
            //calling function to create fields for data
            mainWeatherDisplay(response);
            
            // function for making a second call to ajax to get day forecast using lat and lon from first ajax call
            fiveDayDisplay(response);


        })
        
    }

    var displayGif = function() {
        var apiKey = "haa5BIHFqA1db5u0Jt43swEV7nrNwjrc"
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifWeather + "&api_key="+ apiKey;

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            
            gifURL = response.data[0].images.fixed_height.url;

            var $img = $("<img>", {
                id: "weather-gif",
                height: "180px",
                width: "180px;",
                src: gifURL,
            })
            
            $("#main-weather").append($img)
        });
    }

    var previousSearchWeather = function() {

        //clear main weather and 5 day forecast
        $("#main-weather").empty();
        $("#five-day").empty();
 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="  + $redoSearch + "&units=metric&appid=" + apiKey;
        
        // ajax query
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            gifWeather = response.weather[0].description

            displayGif()

            //calling function to create fields for data
            mainWeatherDisplay(response);
            
            // function for making a second call to ajax to get day forecast using lat and lon from first ajax call
            fiveDayDisplay(response);        
        })

        // used to empty the field after input 
    }

    var checkForEnter = function() {
        if ( event.key === "Enter") {
            createSearch()
        }
    }

    var mainWeatherDisplay = function(response) {
        //  creating variables for storing data from the response
        var cityName = response.name;
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed
        var country = response.sys.country
        var icon = response.weather[0].icon;
        var iconTitle = response.weather[0].description;

        var $icon = $("<img>", {
            src: "https://openweathermap.org/img/wn/" + icon + "@2x.png",
            title: iconTitle,
            alt: iconTitle,
            height: "50px",
            width: "50px",
        })
        

        // creating all the elements that make up the main weather display and giving them id and text
        var $cityName = $("<h3>", {
            id: "city-name",
            text: "City: " + cityName + ", " + country + " - " + month 
        })

        var $temp = $("<p>", {
            id: "temp",
            html: "Temperature: " + temp + '&#8451;',
        })

        var $wind = $("<p>", {
            id: "wind",
            html: "Wind Speed: " + wind,
        })

        var $humidity = $("<p>", {
            id: "humidity",
            text: "Humidity: " + humidity + "%",
        })

        $("#main-weather").append($cityName, $temp, $humidity, $wind);
        $temp.append($icon)

        // add this styling
        var $mainWeather = $("#main-weather");

        $mainWeather.css({
            "margin-top": "5px",
            "margin-bottom": "5px",
            padding: "10px",
            border: "1px solid white",
            "border-radius": "5px",

        })
        
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
           
           
            // making the variable equal to the uvi from the searched city 
            var uvi = response.daily[0].uvi;

            // create variable for uvi index
            var $uvi = $("<p>", {
                id: "uvi-index",
                text: "UVI: " + uvi
            })

            // running checks on the uvi level and changing the background color depending on what level it is 
            if (uvi <= 2) {
                $uvi.css({
                    "background-color": "green",
                })
            } else if ((uvi >= 3) && (uvi <= 5)) {
                $uvi.css({
                    "background-color": "yellow",
                })
            } else if ((uvi >= 6) && (uvi <= 7)) {
                $uvi.css({
                    "background-color": "orange",
                })
            } else if ((uvi >= 8) && (uvi <= 10)) {
                $uvi.css({
                    "background-color": "red",
                })
            } else {
                $uvi.css({
                    "background-color": "purple",
                })
            }
    
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
                //  variable for changing the day 
                var changingDay = moment().add((i+1),"days").format('MMMM Do')

                // creating all the 5-day elements
                var $newDiv = $("<div>", {
                    class: "col-lg-2 forecast",
                    id: "day-" + (i+1)
                })

                var $heading = $("<h5>", {
                    text: changingDay,
                })

                var $dayTemp = $("<p>", {
                    html: "Temperature: " + dailyArray[(i+1)].temp.day +  '&#8451;',
                }) 

                var icon = dailyArray[(i+1)].weather[0].icon;
                var dayTitle = dailyArray[(i+1)].weather[0].description;

                var $dayIcon = $("<img>", {
                    src: "https://openweathermap.org/img/wn/" + icon + "@2x.png",
                    title: dayTitle,
                    alt: dayTitle,
                    height: "50px",
                    width: "50px",
                })

                var $dayHum = $("<p>", {
                    text: "Humidity: "+ dailyArray[(i+1)].humidity + "%",
                })

                $newRow.append($newDiv)
                $newDiv.append($heading, $dayTemp, $dayHum)
                $dayTemp.append($dayIcon)
            }
           
        })

    }
    $("#search-container").on("click", ".search-contents", function() {
        $redoSearch = $(this).text();
        lastCitySearched = $redoSearch;
        saveSearchFunction()

        // delete after testing
        console.log(lastCitySearched)

         previousSearchWeather()
    })

    var saveSearchFunction = function() {
        if (lastCitySearched === "") {
            return
        }
        // console.log(lastCitySearched)
        var searches = JSON.parse(window.localStorage.getItem("searches")) || []; 
        
        var searchHistory = {
            city: lastCitySearched,
        }

        searches.push(searchHistory)
        window.localStorage.setItem("searches", JSON.stringify(searches));
    }

    var loadOldSearch = function() {
        
        
        if (window.localStorage.getItem("searches") === null) {
            return
            //...
        } else {
            var searches = JSON.parse(window.localStorage.getItem("searches")) || []; 

            var iNum = searches.length - 1
            var previousCity = searches[iNum].city
     
    
            // create a new div and fill it with text from search
            var $newDiv = $("<div>", {
                class: "search-contents",
                text: previousCity,
            });
        
            // newdiv css
            $($newDiv).css({
                border: "white solid 1px",
                padding: "10px",
            })
        
            // append the new div
            $("#search-container").prepend($newDiv)
    
            //set value of $redoSearch
            $redoSearch = previousCity
    
            // run logWeatherFunction
            previousSearchWeather();
        }
       
    }
    
  
    loadOldSearch()
 
    

    

    $("#search-btn").on("click", createSearch);
    $("#city-search").on("keydown", checkForEnter);
    $("#clearBtn").on("click", clearSearches);
})