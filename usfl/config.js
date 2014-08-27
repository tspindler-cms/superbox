var config = {};

config.db = 'localhost:27017/';

config.leagues = {};

config.leagues.apfl = {};
config.leagues.apfl.name = "All Pro Football League";
config.leagues.apfl.entry = "apfl";
config.leagues.apfl.week = "18";
config.leagues.apfl.year = "2015";
config.leagues.apfl.url = "http://www.fof-ffl.com/APFL/APFL.html";

config.leagues.ffl = {};
config.leagues.ffl.name = "Franchise Football League";
config.leagues.ffl.entry = "ffl";
config.leagues.ffl.week = "6";
config.leagues.ffl.year = "2040";
config.leagues.ffl.url = "http://fof-ffl.com/FFL/default.html";

config.leagues.tfl = {};
config.leagues.tfl.name = "Throwback Football League";
config.leagues.tfl.entry = "tfl";
config.leagues.tfl.week = "9";
config.leagues.tfl.year = "1994";
config.leagues.tfl.url = "http://www.fof-ffl.com/TFL/index.html";

config.leagues.usfl = {};
config.leagues.usfl.name = "USFL";
config.leagues.usfl.entry = "usfl";
config.leagues.usfl.week = "3";
config.leagues.usfl.year = "2035";
config.leagues.usfl.url = "http://www.fof-ffl.com/USFL/home.html";

module.exports = config;
