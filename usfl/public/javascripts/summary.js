$(document).ready(function() {
  $( "#dialog" ).dialog({ width:350 }, { autoOpen: false }, { position: { my: "left top", at: "right+20 top" } })
                .css("font-size", "80%");;
  var playerInfo;
  var playerStats;
  $.ajax({
    type: "GET",
    url: "/player/2035",
    dataType: "json",
    success: function(data) {console.log("got data"); setup(data) }
  });
  $.getScript('/javascripts/view.js');
});

function setup(players) {

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
  $( "#ready" ).html("<h3>Ready with 2035 player information</h3>");
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

