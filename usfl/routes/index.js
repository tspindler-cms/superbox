var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
// var db = monk(config.db);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Leagues Overview', 'leagues': req.leagues });
});


router.get('/league/:league', function(req, res) {
  var league = req.param('league');
  res.redirect(league + '/index.html');
});

router.get('/league/:league/', function(req, res) {
  var league = req.param('league');
  res.redirect(league + '/index.html');
  // res.redirect('/usfl/index.html');
});

router.get('/league/:league/:page', function(req, res) {
  var page = req.param('page');
  var league = req.param('league');
  var leagues = req.leagues;
  console.log('page is ' + page + ' in league ' + league);
  if (page.indexOf('jpg') > -1 ||
             page.indexOf('gif') > -1 ||
             page.indexOf('png') > -1) {
    console.log('found graphics');
    res.redirect('/' + league + 'box/' + page);
  } else if (page.indexOf('log') > -1) {
    res.render('elog', { 'page': page, 'league': league, 'leagues': leagues });
  } else if (page.indexOf('summary') > -1 ||
             page.indexOf('roster') > -1 ||
             page.indexOf('draft') > -1 ||
             page.indexOf('statistics') > -1) {
    res.render('estat', { 'page' : page, 'league': league, 'leagues': leagues });
  } else if (page.indexOf('box') > -1) {
    res.render('superbox', { 'page': page, 'league': league, 'leagues': leagues });
  } else {
    console.log('in league ' + league);
    res.render(league + '/' + page);
  }
});


// add the player ratings for the current season
function showPlayer(req, res, player, league, year) {
  var db = monk(req.dbhost + league);
  var collection = db.get('ratings');
  var playerId = player['Player_ID'];
  collection.findOne({'Player_ID': playerId, 'sbYear': year}, {}, function(e, docs) {
    if (docs != null) {
      docs.coll = 'player_ratings';
      player.ratings = docs;
      res.send(JSON.stringify(player));
    } else {
      ratings = {};
      ratings.message = "Not found";
      player.ratings = ratings;
      res.send(JSON.stringify(player));
    }
  });
}

// get info on player with first and last
// note that only one player info is ever returned
router.get('/player/:first/:last/:league', function(req, res) {
  var league = req.param('league');
  var leagues = req.leagues;
  var year = leagues[league]['year'];
  var db = monk(req.dbhost + league);
  var collection = db.get('player_information');
  var first = req.param('first');
  var last = req.param('last');
  console.log('looking for ' + first + ' ' + last);
  collection.findOne({'First_Name': req.param('first'), 'Last_Name': req.param('last')}, {}, function(e, docs) {
    console.log('this is found: ' + JSON.stringify(docs));
    docs.coll = 'player_information';
    showPlayer(req, res, docs, league, year);
  });
});

// get a list of all players in player_information
router.get('/player/:league', function(req, res) {
  var league = req.param('league');
  var db = monk(req.dbhost + league);
  var collection = db.get('player_information');
  collection.find({},{},function(e,docs){
    var players = [];
    if (typeof(docs) != 'undefined') {
      docs.forEach(function(p) {
        var player = {};
        player.Position = p.Position;
        player.First_Name = p.First_Name;
        player.Last_Name = p.Last_Name;
        players.push(player);
      });
      res.send(JSON.stringify(players));
    }
  });
});

router.get('/player/:year/:league', function(req, res) {
  var league = req.param('league');
  var year = req.param('year');
  console.log('Getting player info for year ' + year + ' for ' + league);
  var db = monk(req.dbhost + league);
  var collection = db.get('ratings');
  collection.find({'sbYear': '' + year}, ['Player_ID'], function(e, docs) {
    var players = [];
    var info = db.get('player_information');
    console.log('found players ...');
    if (typeof(docs) != 'undefined') {
      var wait = docs.length;
      docs.forEach(function(player) {
        var playerId = player.Player_ID;
        info.findOne({'Player_ID': playerId}, ['Player_ID', 'First_Name', 'Last_Name', 'Position' ], function(e, docs) {
          players.push(docs);
          wait--;
        });
      });
      function waitForCompletion() {
        if (wait > 0) {
          console.log("Wait is " + wait);
          setTimeout(waitForCompletion, 100);
          return;
        }
        res.send(JSON.stringify(players));
      }
      waitForCompletion();
    } else {
      res.send("Found no players");
    }
  });
});

router.get('/playerid/:id/:league', function(req, res) {
  var league = req.param('league');
  var db = monk(req.dbhost + league);
  var collection = db.get('player_information');
  var id = req.param('id');
  collection.findOne({'Player_ID': id}, ['Player_ID', 'First_Name', 'Last_Name', 'Position'], function(e, docs) {
    res.send(JSON.stringify(docs));
  });
});

router.get('/playerid/detail/:id/:league', function(req, res) {
  var league = req.param('league');
  var db = monk(req.dbhost + league);
  var collection = db.get('ratings');
  var id = req.param('id');
  collection.find({'Player_ID': id}, function(e, docs) {
    var info = db.get('player_information');
    var detail = docs;
    info.findOne({'Player_ID': id}, ['Player_ID', 'First_Name', 'Last_Name', 'Position'], function(e, docs) {
      res.render('playerdetail', { 'detail': detail, 'info': docs } );
    });
  });
});

router.get('/playerid/year/:year/:league', function(req, res) {
  var league = req.param('league');
  var db = monk(req.dbhost + league);
  var collection = db.get('player_ratings_season_' + req.param('year'));
  collection.distinct('Player_ID', function(e, docs) {
    console.log('docs is ' + docs);
    var playerInfo = db.get('player_information');
    // playerInfo.find({'Player_ID': '{$in: ' + docs + '}'}, ['Player_ID', 'First_Name', 'Last_Name', 'Position'], function(e, docs) {
      // res.send(JSON.stringify(docs));
    // });
    var players = [];
    docs.forEach(function(playerId) {
      console.log('found player id ' + playerId);
      var player = {};
      playerInfo.findOne({'Player_ID': playerId}, ['Player_ID', 'First_Name', 'Last_Name', 'Position'], function(e, docs) {
	players.push(docs);
      });
      players.push(player);
    });
    res.send(JSON.stringify(players));
  });
});

// get position, first and last name of players in player_information
router.get('/players/:league', function(req, res) {
  var league = req.param('league');
  var db = monk(req.dbhost + league);
  var collection = db.get('player_information');
  collection.find({},{},function(e,docs){
    res.render('playerinfo', {
      'playerinfo' : docs
    });
  });
});

// get the seasons stat for week
router.get('/playerid/:id/year/:year/week/:week/:league', function(req, res) {
  var league = req.param('league');
  var db = monk(req.dbhost + league);
  var collection = db.get('seasons');
  
  var id = req.param('id');
  var year = req.param('year');
  var week = req.param('week');

  collection.findOne({'Player_ID': id, 'Year': year, 'Week': week}, function(e, docs) {
    res.send(docs);
  });
});

module.exports = router;
