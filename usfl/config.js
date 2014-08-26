var config = {};

config.db = 'localhost:27017/';

config.leagues = {};
config.leagues.ffl = {};
config.leagues.ffl.week = "6";
config.leagues.ffl.year = "2040";
config.leagues.usfl = {};
config.leagues.usfl.week = "3";
config.leagues.usfl.year = "2035";

module.exports = config;
