$(document).ready(function() {
  $( "#dialog" ).dialog({ width:350 }, { autoOpen: false }, { position: { my: "left top", at: "right+20 top" } })
	        .css("font-size", "80%");;
  var playerInfo;
  var playerStats;
  $.ajax({
    type: "GET",
    // url: "http://usflga.me:3000/player/2035",
    url: "/player/2035",
    dataType: "json",
    success: function(data) {console.log("got data"); getPlayers(data)}
  });
  $.getScript('/javascripts/view.js');
});

function getPlayers(data) {
  data.forEach(function(player) {
    var playerId = player.Player_ID;
    $.ajax({
        type: "GET",
        // url: "http://usflga.me:3000/playerid/" + playerId,
        url: "/playerid/" + playerId,
        dataType: "json",
        success: function(data) {markPlayer(data)}
     });
  });
  $( "#ready" ).html("<h3>Ready with 2035 player information</h3>");
}

function markPlayer(player) {
  var id = player["Player_ID"];
  var name = player["First_Name"] + " " + player["Last_Name"];
  var pos = player["Position"];
  // console.log("marking player " + name);
  $( "font" ).filter(function() {
    return $(this).text().indexOf(name) > -1;
  }).closest("font").click(function() {showInfo(id, name, pos, player)});
}

