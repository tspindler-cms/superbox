var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/usfl', function(req, res) {
  res.redirect('/usfl/index.html');
});

router.get('/usfl/', function(req, res) {
  res.redirect('/usfl/index.html');
});

router.get('/usfl/:page', function(req, res) {
  var page = req.param('page');
  console.log('page is ' + page);
  if (page.indexOf('box') > -1) {
    res.render('superbox', { 'page': page });
  } else if (page.indexOf('summary') > -1 ||
             page.indexOf('roster') > -1 ||
             page.indexOf('draft') > -1 ||
             page.indexOf('statistics') > -1) {
    res.render('estat', { 'page' : page });
  } else if (page.indexOf('jpg') > -1 ||
             page.indexOf('gif') > -1 ||
             page.indexOf('png') > -1) {
    console.log('found graphics');
    res.redirect('/box/' + page);
  } else {
    res.render('usfl/' + page);
  }
});

// add the player ratings for the current season
function showPlayer(req, res, player) {
  var db = req.db;
  var collection = db.get('ratings');
  var playerId = player['Player_ID'];
  collection.findOne({'Player_ID': playerId, 'sbYear': '2035'}, {}, function(e, docs) {
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
router.get('/player/:first/:last', function(req, res) {
  var db = req.db;
  var collection = db.get('player_information');
  var first = req.param('first');
  var last = req.param('last');
  console.log('looking for ' + first + ' ' + last);
  collection.findOne({'First_Name': req.param('first'), 'Last_Name': req.param('last')}, {}, function(e, docs) {
    console.log('this is found: ' + JSON.stringify(docs));
    docs.coll = 'player_information';
    showPlayer(req, res, docs);
  });
});

// get a list of all players in player_information
router.get('/player/', function(req, res) {
    var db = req.db;
    var collection = db.get('player_information');
    collection.find({},{},function(e,docs){
        var players = [];

        docs.forEach(function(p) {
          var player = {};
          player.Position = p.Position;
          player.First_Name = p.First_Name;
          player.Last_Name = p.Last_Name;
          players.push(player);
        });
        res.send(JSON.stringify(players));
    });
});

router.get('/player/:year', function(req, res) {
  var db = req.db;
  var collection = db.get('ratings');
  var year = req.param('year');
  collection.find({'sbYear': year}, ['Player_ID'], function(e, docs) {
    var players = [];
    var info = db.get('player_information');
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
  });
});

router.get('/playerid/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('player_information');
  var id = req.param('id');
  collection.findOne({'Player_ID': id}, ['Player_ID', 'First_Name', 'Last_Name', 'Position'], function(e, docs) {
    res.send(JSON.stringify(docs));
  });
});

router.get('/playerid/detail/:id', function(req, res) {
  var db = req.db;
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

router.get('/playerid/year/:year', function(req, res) {
  console.log('in playerid year');
  var db = req.db;
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
router.get('/players/', function(req, res) {
    var db = req.db;
    var collection = db.get('player_information');
    collection.find({},{},function(e,docs){
        res.render('playerinfo', {
            'playerinfo' : docs
        });
    });
});

// get the seasons stat for week
router.get('/playerid/:id/year/:year/week/:week', function(req, res) {
  var db = req.db;
  var collection = db.get('seasons');
  
  var id = req.param('id');
  var year = req.param('year');
  var week = req.param('week');

  collection.findOne({'Player_ID': id, 'Year': year, 'Week': week}, function(e, docs) {
    res.send(docs);
  });
});

module.exports = router;
