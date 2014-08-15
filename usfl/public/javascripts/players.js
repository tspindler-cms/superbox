$(document).ready(function() {
  $( "#dialog" ).dialog({ width:350 }, { autoOpen: false }, { position: { my: "left top", at: "right+20 top" } })
	        .css("font-size", "80%");;
  var playerInfo;
  var playerStats;
  $.ajax({
    type: "GET",
    url: "http://usflga.me:3000/player/2035",
    dataType: "json",
    success: function(data) {console.log("got data"); getPlayers(data)}
  });
});

function getPlayers(data) {
  data.forEach(function(playerId) {
    $.ajax({
        type: "GET",
        url: "http://usflga.me:3000/playerid/" + playerId,
        dataType: "json",
        success: function(data) {markPlayer(data)}
     });
  });
  $( "#ready" ).html("<p>Ready with player information</p>");
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

function stats(player) {
  var first = player["First_Name"];
  var last = player["Last_Name"];
  $.ajax({
    type: "GET",
    url: "http://usflga.me:3000/player/" + first + "/" + last,
    dataType: "json",
    async: false,
    success: function(data) {showStat(data)}
  });
}

function showStat(player) {
  var retStat = "<table cellpadding='4'><col width='200'><col width='100'>";
  for (var prop in player.ratings) {
    if ( (player.ratings[prop] != "0") &&
         (prop != "_id") &&
         (prop != "coll") &&
         (prop != "line") &&
         (prop != "Record_Number") ) {
      var cleanProp = prop.replace("_", " ");
      retStat += "<tr><td>" + cleanProp + ":</td><td align='right'>" + player.ratings[prop] + "</td></tr>\n";
    }
  }
  retStat += "</table>";
  $( "#tab1" ).html(retStat);

  // brute force removal
  player.ratings = "0";
  // convert date
  var year = player["Year_Born"];
  var month = player["Month_Born"];
  var day = player["Day_Born"];
  player["Year_Born"] = "0";
  player["Month_Born"] = "0";
  player["Day_Born"] = "0";
  player["Date of Birth"] = year + "-" + month + "-" + day; 
  player["Age (roughly)"] = 2035 - year;

  var retStat = "<table cellpadding='4'><col width='200'><col width='100'>";
  for (var prop in player) {
    if ( (player[prop] != "0") &&
         (prop != "_id") &&
         (prop != "coll") &&
         (prop != "line") &&
         (prop != "Record_Number") &&
         (prop != "Drafted_By") &&
         (prop != "College") &&
         (prop != "Drafted_Position") &&
         (prop != "Player_ID") &&
         (prop.indexOf("SP") < 0) &&
         (prop.indexOf("SY") < 0) &&
         (prop.indexOf("Season_1") < 0) &&
         (prop.indexOf("Home") < 0) ) {
      var cleanProp = prop.replace(/_/g, " ");
      retStat += "<tr><td>" + cleanProp + ":</td><td align='right'>" + player[prop] + "</td></tr>\n";
    }
  }
  retStat += "</table>";
  $( "#tab2" ).html(retStat);
}

function showInfo(id, name, pos, player) {
  var tabs = $("<div><ul><li><a href='#tab1'>stats</a></li><li><a href='#tab2'>info</a></li><li><a href='#tab3'>detail</a></li></ul><div id='tab1'>Tab1 content</div><div id='tab2'>tab2 content</div><div id='tab3'><a href='/playerid/detail/" + id + "' target='_blank'>" + name + "</a></div></div>");
  $( "#dialog" ).empty().append(tabs);
  tabs.show();
  tabs.tabs();
  $("span.ui-dialog-title").text(pos + " " + name);
  $( "#dialog" ).parent().css({position:"fixed"}).end().dialog("open");
  stats(player);
}

