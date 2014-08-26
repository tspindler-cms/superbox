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
    success: function(data) {console.log("got data"); setup(data) }
  });
  $.getScript('/javascripts/view.js');
});

function setup(players) {
  var year = leagues[league]['year'];

  $( "table tr td table tr td"  )
  .filter(function() {
    if ($(this).text() == "USFL") {
      return false;
    }
    return true;
  })
  .click(function() {
    console.log( "Click on " + $(this).text() );
    showPlayerInfo($(this).text(), players);
  });
  $( "#ready" ).html("<h3><font color='black'>Ready with " + year + " player information</font></h3>");
}

function showPlayerInfo(name, players) {
  console.log("Searching " + name);
  var found = false;
  players.forEach(function(player) {
    if (found) {
      return;
    }
    var first = player["First_Name"];
    var last = player["Last_Name"];
    if ((name.indexOf(first) > -1) && (name.indexOf(last) > -1)) {
      console.log("found " + JSON.stringify(player));
      found = true;
      showInfo(player["Player_ID"], first + " " + last, player["Position"], player);
      return;
    };
  });
}

