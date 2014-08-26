$(document).ready(function() {
  $( "#dialog" ).dialog({ width:350 }, { autoOpen: false }, { position: { my: "left top", at: "right+20 top" } })
                .css("font-size", "80%");
});

function cleanProperty(prop) {
  return prop.replace(/_/g, " ");
}

function stats(player) {
  var first = player["First_Name"];
  var last = player["Last_Name"];
  var url = "/player/" + first + "/" + last + "/" + league;
  console.log(url);
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    async: false,
    success: function(data) {showStat(data)}
  });
}

function showStat(player) {
  var retStat = "<table cellpadding='2'><col width='200'><col width='100'>";
  for (var prop in player.ratings) {
    if ( (player.ratings[prop] != "0") &&
         (prop != "_id") &&
         (prop != "coll") &&
         (prop != "line") &&
         (prop != "sbYear") &&
         (prop != "Record_Number") ) {
      var cleanProp = cleanProperty(prop); 
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
  player["Age (roughly)"] = leagues[league]['year'] - year;

  var retStat = "<table cellpadding='2'><col width='200'><col width='100'>";
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
         (prop.indexOf("sbYear") < 0) &&
         (prop.indexOf("SP") < 0) &&
         (prop.indexOf("SY") < 0) &&
         (prop.indexOf("Season_1") < 0) &&
         (prop.indexOf("Home") < 0) ) {
      var cleanProp = cleanProperty(prop);
      retStat += "<tr><td>" + cleanProp + ":</td><td align='right'>" + player[prop] + "</td></tr>\n";
    }
  }
  retStat += "</table>";
  $( "#tab2" ).html(retStat);
}

function lastWeek(player) {
  var id = player["Player_ID"];
  var year = leagues[league]["year"];
  var week = leagues[league]["week"];
  var url =  "/playerid/" + id + "/year/" + year + "/week/" + week + "/" + league;
  console.log("Last week stat " + year + " " + week + ":" + url);
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    async: false,
    success: function(data) {showLastWeek(data)}
  });
}

function validProp(prop, value) {
  var blockedProps = [ "_id", "line", "Record_Number", "Player_ID" ];
  if (value == "0") {
    return false;
  } else if (blockedProps.indexOf(prop) > -1) {
    return false;
  }
  return true;
}

function showLastWeek(player) {
  var retStat = "<table cellpadding='2'><col width='200'><col width='100'>";
  for (var prop in player) {
    if (validProp(prop, player[prop])) {
      var cleanProp = cleanProperty(prop);
      retStat += "<tr><td>" + cleanProp + ":</td><td align='right'>" + player[prop] + "</td></tr>\n";
    }
  }
  retStat += "</table>";
  $( "#tab3" ).html(retStat);
}

function showInfo(id, name, pos, player) {
  console.log("Showing " + name);
  var tabs = $("<div><ul><li><a href='#tab1'>stats</a></li><li><a href='#tab2'>info</a></li><li><a href='#tab3'>last week</a></li></ul><div id='tab1'>tab1 content</div><div id='tab2'>tab2 content</div><div id='tab3'>tab3 content</div></div>");
  $( "#dialog" ).empty().append(tabs);
  tabs.show();
  tabs.tabs();
  tabs.css({height: "700px", overflow:"auto"});
  $("span.ui-dialog-title").html("<a href='/playerid/detail/" + id + "/" + league + "' target='_blank'>" + pos + " " + name + "</a>");
  $( "#dialog" ).parent().css({position:"fixed"}).end().dialog("open");
  stats(player);
  lastWeek(player);
}

