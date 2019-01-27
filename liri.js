require("dotenv").config();
var fs = require('fs');
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require('moment');


var command = process.argv[2];
var searchVal = "";

for (var i = 3; i < process.argv.length; i++) {
    searchVal += process.argv[i] + " ";
};

function getConcerts(searchVal) {
    axios.get("https://rest.bandsintown.com/artists/" + searchVal.trim() + "/events?app_id=codingbootcamp").then(
        function (response) {
            for (i = 0; i < 5; i++) {
                console.log("\n------------------------------------------------");
                console.log("Artist/Band: " + searchVal);
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
                console.log("Date: " + moment(response.data[i].datetime).format("L"));
                console.log("--------------------------------------------------");
            }
        });
}

function spotifySearch(searchVal) {
    if (searchVal == "") {
        searchVal = "The Sign Ace of Base";
    }

    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: searchVal.trim() }, function (respError, response) {

        var song = response.tracks.items;

        for (var i = 0; i < 3; i++) {
            console.log("\n--------------- Spotify Search Result -------------------");
            console.log(("Artist: " + song[i].artists[0].name));
            console.log(("Song title: " + song[i].name));
            console.log(("Album name: " + song[i].album.name));
            console.log(("URL Preview: " + song[i].preview_url));
            console.log("---------------------------------------------------------");

        }


    })
};

function searchMovie(searchVal) {
    if (searchVal == "") {
        searchVal = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchVal.trim() + "&y=&plot=short&apikey=trilogy";

    axios
        .get(queryUrl)
        .then(function (response) {

            console.log("\n--------------- OMDB Search Results -----------------");
            console.log("Movie Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("-----------------------------------------------------\n");
        });
}

function doWhat() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        nComm = dataArr[0];
        nSearch = dataArr[1];
        if (nComm === "concert-this") {
            getConcerts(nSearch);
        } else if (nComm === "spotify-this-song") {
            spotifySearch(nSearch);
        } else {
            searchMovie(nSearch);
        }

    })
}



switch (command) {
    case "concert-this":
        getConcerts(searchVal);
        break;
    case "spotify-this-song":
        spotifySearch(searchVal);
        break;
    case "movie-this":
        searchMovie(searchVal);
        break;
    case "do-what-it-says":
        doWhat();
        break;
}



