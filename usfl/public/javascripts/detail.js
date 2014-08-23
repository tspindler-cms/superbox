$(document).ready(function() {
  console.log("ready: " + JSON.stringify(detail));

  var fields = [];
  var tmpl = detail[detail.length-1];
  for (var prop in tmpl) {
    if (tmpl[prop] != "0" &&
        prop != "sbYear" &&
        prop != "_id" &&
        prop != "Player_ID" &&
        prop != "Record_Number" &&
        prop != "line" &&
        prop != "Year" &&
        prop != "Scouting") {
      fields.push(prop);
    }
  }
  
  var table = "<table cellpadding='1'><tr><th>Date</th>";
  fields.forEach(function(prop) {
    var cleanprop = prop.replace("_", " ");
    table += "<th>" + cleanprop + "</th>";
  });
  table += "</tr>";
  detail.forEach(function(rating) {
    var line = "<tr><td style='text-align: center'>" + rating.Year + " " + rating.Scouting + "</td>";
    var valid = false;
    fields.forEach(function(prop) {
      line += "<td style='text-align: center'>" + rating[prop] + "</td>";
      if (typeof(rating[prop]) != 'undefined') {
        valid = true;
      }
    });
    line += "</tr>";
    if (valid) {
      table += line;
    }
  });
  table += "</table>";
  $( "#detail" ).html(table);
  console.log(info);
  $( "h1" ).text(info.Position + " " + info.First_Name + " " + info.Last_Name);
});

