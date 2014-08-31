$(document).ready(function() {
  $( "#dynamic" ).html(JSON.stringify(ld["name"]));
  console.log("ld:" + JSON.stringify(ld));


  var standings = {};
  ld["standings"].forEach(function(doc) {
    ["Wins", "Losses", "Team"].forEach(function(field) {
      if (doc[field] == undefined) {
        doc[field] = 0;
      }
    });
    var div = doc["Division"];
    var team = getTeamName(doc["Team"]);
    console.log(doc["Division"] + " " + doc["Wins"] + " " + doc["Losses"] + " " + doc["Team"]);
    if (standings[div] == undefined) {
      standings[div] = {};
    }
    if (standings[div][team] == undefined) {
      standings[div][team] = {};
    }
    standings[div][team]["Wins"] = doc["Wins"];
    standings[div][team]["Losses"] = doc["Losses"];
  });

  var delay = 2000;
  var i = 0;
  var keys = [];
  for (var div in standings) {
    keys.push(div);
  }
  function showDivStanding() {
    if (i < keys.length) {
      i++;
    }
    if (i == keys.length) {
      i = 0;
    }
    setTimeout(showDivStanding, delay * i);
    var html = getHtmlStanding(standings, keys[i]);
    $( "#dynamic" ).html(html);
    return;
  }
  showDivStanding();
});

function getHtmlStanding(standings, div) {
  console.log(JSON.stringify(standings[div]));
  var h = "<h3>"  + div + "</h3><table>";
  for (team in standings[div]) {
    h += "<tr><td align='left'>" +  team + "</td><td>" + standings[div][team]["Wins"] + "</td><td>" + standings[div][team]["Losses"] + "</td></tr>"; 
  }
  h += "</table>";
  return h;
}

function getTeamName(n) {
  if (n == "0") {
    return "Seattle Stingrays";
  }
  if (n == "1") {
    return "Florida Hurricanes";
  }
  if (n == "2") {
    return "Minnesota Golden Hawks";
  }
  if (n == "3") {
    return "New York Blizzard";
  }
  if (n == "4") {
    return "Atlanta Arsenal";
  }
  if (n == "5") {
    return "Iowa City Thunder";
  }
  if (n == "6") {
    return "Denver Death";
  }
  if (n == "7") {
    return "Boston Killer Bees";
  } 
  if (n == "8") {
    return "Boise City Rough Riders";
  } 
  if (n == "9") {
    return "Los Angeles Marauders";
  }
  if (n == "10") {
    return "Chicago Crusaders";
  }
  if (n == "11") {
    return "Wichita Harvesters";
  }
  if (n == "12") {
    return "Jacksonville Edge";
  }
  if (n == "13") {
    return "San Diego Seawolves";
  }
  if (n == "14") {
    return "Newark Red Dogs";
  }
  if (n == "15") {
    return "Detroit Demolition";
  }
  if (n == "16") {
    return "Columbus (OH) Wardogs";
  }
  if (n == "17") {
    return "Anaheim Pirates";
  }
  if (n == "18") {
    return "Baltimore Boilermakers";
  }
  if (n == "19") {
    return "Orlando Sharks";
  }
  if (n == "20") {
    return "Santa Rosa Ravens";
  }
  if (n == "21") {
    return "Hartford Diesel";
  }
  if (n == "22") {
    return "Fargo (ND) Freeze";
  }
  if (n == "23") {
    return "St. Louis Nemesis";
  }
  if (n == "24") {
    return "Portland (OR) Dragons";
  }
  if (n == "25") {
    return "Sacramento Quake";
  }
  if (n == "26") {
    return "San Francisco Knights";
  }
  if (n == "27") {
    return "Texas Rattlers";
  }
  if (n == "28") {
    return "Richmond Generals";
  }
  if (n == "29") {
    return "Erie Phantoms";
  }
  if (n == "30") {
    return "Champaign (IL) Thunder";
  }
  if (n == "31") {
    return "Charlotte Fight'n Squirrels";
  }
  return n;
}
