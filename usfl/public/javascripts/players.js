var globalPlayers = [];

$(document).ready(function() {
  console.log("league is " + league);
  console.log("leagues is " + JSON.stringify(leagues));
  var year = leagues[league]['year'];
  $( "#ready" ).html("<h3><font color='black'>Loading " + year + " player information</font></h3>");
  var url = "/player/" + year + "/" + league;
  console.log("Getting " + url);

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function(data) {console.log("got data"); setup(data); } 
  });
  $.getScript('/javascripts/view.js');
});

function setup(players) {
  var year = leagues[league]['year'];

  $( "font" )
  .click(function() {
    console.log("clicked on " + $(this).text());
    showPlayerInfo($(this).text(), players);
  });

  $( "#ready" ).html("<h3><font color='black'>Ready with " + year + " player information</font></h3>");
}

function showPlayer(playerId) {
  globalPlayers.forEach(function(player) {
    if (player["Player_ID"] == playerId) {
      showInfo(player["Player_ID"], player["First_Name"] + " " + player["Last_Name"], player["Position"], player);
      return;
    };
  });
}

function selectPlayer(playersObj) {
  // transform to array, not really needed but more comfy
  var players = [];
  for (var playerKey in playersObj) {
    players.push(playersObj[playerKey]);
  }
  globalPlayers = players;

  var playerCount = players.length;
  var tabshtml = "<div><ul>";
  var content = "";
  while (playerCount-- > 0) {
    var player = players[playerCount];
    var info = player["Position"] + " " + player["Last_Name"];
    var id = player["Player_ID"];
    tabshtml += "<li><a class='select' href='#tab" + playerCount + "' playerid='" + id + "'>" + info + "</a></li>";
    content += "<div id='tab" + playerCount + "'>Select player above</div>";
  }
  tabshtml += "</ul>" + content + "</div>"
  console.log("tabshtml is " + tabshtml);
  var tabs = $( tabshtml );
  $( "#dialog" ).empty().append(tabs);
  tabs.show();
  tabs.tabs();

  $( "a.select" ).click(function() {
    console.log("Clicked on " + $(this).text() + " " + $(this).attr("playerid"));
    showPlayer($(this).attr("playerid"));
  });
  var playerCount = players.length;
  while (playerCount-- > 0) {
    var player = players[playerCount];
    var tabname = "#tab" + playerCount;
    console.log("test " + tabname);
    $( tabname ).click(function() {
      console.log("Clicked on tab " + $(this).text());
      showPlayer($(this).text());
    });
  }
  // tabs.css({height: "700px", overflow:"auto"});
  $( "span.ui-dialog-title" ).text("Select");
  $( "#dialog" ).parent().css({position:"fixed"}).end().dialog("open");

}


function showPlayerInfo(name, players) {
  console.log("Searching in " + name);
  var foundPlayers = {};
  players.forEach(function(player) {
    var first = player["First_Name"];
    var last = player["Last_Name"];
    if ((name.indexOf(first) > -1) && (name.indexOf(last) > -1)) {
      console.log("found " + JSON.stringify(player));
      foundPlayers[player["Player_ID"]] = player;
    };
  });

  var playerCount = Object.keys(foundPlayers).length;
  console.log("Found " + Object.keys(foundPlayers).length + " players");
  if (1 == playerCount) {
    for (var playerKey in foundPlayers) {
      var player = foundPlayers[playerKey];
      console.log("player is " + JSON.stringify(player));
      showInfo(player["Player_ID"], player["First_Name"] + " " + player["Last_Name"], player["Position"], player);
    }
  } else if (1 < playerCount) {
    console.log("Selecting one ...");
    selectPlayer(foundPlayers);
  }
}

