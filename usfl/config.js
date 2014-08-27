var config = {};

config.db = 'localhost:27017/';

config.leagues = {};
config.leagues.ffl = {};
config.leagues.ffl.week = "6";
config.leagues.ffl.year = "2040";
config.leagues.usfl = {};
config.leagues.usfl.week = "3";
config.leagues.usfl.year = "2035";
config.leagues.tfl = {};
config.leagues.tfl.week = "9";
config.leagues.tfl.year = "1994";
config.leagues.apfl = {};
config.leagues.apfl.week = "18";
config.leagues.apfl.year = "2015";

module.exports = config;
