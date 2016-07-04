"use strict";

var jsonObject;
var objectArray = [];
var descriptionArray = [];
var nameArray = [];


// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong><br>',
            ' - last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
          '</li>');

    var reader = new FileReader();
    reader.readAsText(f);

    // Invoked when file is loading. 
    reader.onload = function(){

      var contentfile = reader.result;

      var name; 

      var lgpx =  new L.GPX(contentfile, {
                async: true
              }).on('loaded', function(e) {

                map.fitBounds(e.target.getBounds());
                
                // Convert date to more readable form
                var datumS = e.target.get_start_time().toString();
                var s = datumS.split(" ");

                var datumF = e.target.get_end_time().toString();
                var f = datumF.split(" ");

                // Convert track distance to more readable form
                var trackdistance = e.target.get_distance().toString();
                var trackdis = trackdistance.split(".");

                // Convert Track Duration from ms to more readable form
                var trackduration = e.target.get_total_time();
                var time = parseMsToReadableTime(trackduration);

                // Convert Track Duration from ms to more readable form
                var trackspeed = e.target.get_moving_speed().toString();
                var trackspe = trackspeed.split(".");
                var Nachkomma = trackspe[1];
                Nachkomma = Nachkomma.slice(0,2);

                // returns number of rows in Table
                var i = document.getElementById("tableDBTrackContents").rows.length;
                i++;
                
                // Save Bounds in BoundsArray for Zooming
                objectArray[i] = e.target.getBounds();

                // Save Track Name
                nameArray[i] = document.getElementById("trackName").value;
                //Save Track Description
                descriptionArray[i] = document.getElementById("trackBeschreibung").value;

                // Prepare-Fields for new Track
                reseter($('#testerer'));

                // Set name + description of current track
                document.getElementById("trackNameView").value = nameArray[i];
                document.getElementById("trackBeschreibungView").innerHTML = descriptionArray[i];

                // Add Elements to Content-Table
                $('#tableDBTrackContents').append('<tr class="clickable-row">                                   <td class="likeButton" onmouseup="fncEditCell(this)">'
                  + (i++)                                                                               + '</td><td class="likeButton" onmouseup="fncEditCell(this)">' 
                  + e.target.get_name()                                                                 + '</td><td class="likeButton" onmouseup="fncEditCell(this)">' 
                  + s[0] + " " + s[1] + " " + s[2] + " " + s[3] + " " + s[4]                            + '</td><td class="likeButton" onmouseup="fncEditCell(this)">'
                  + f[0] + " " + f[1] + " " + f[2] + " " + f[3] + " " + f[4]                            + '</td><td class="likeButton" onmouseup="fncEditCell(this)">'
                  + trackdis[0] + " m "                                                                 + '</td><td class="likeButton" onmouseup="fncEditCell(this)">'
                  + time                                                                                + '</td><td class="likeButton" onmouseup="fncEditCell(this)">'
                  + trackspe[0] + "," + Nachkomma + " km/h "                                            + '</td><td class="likeButton" onmouseup="fncEditCell(this)">'
                  + '</td></tr>'
                );
              })
              .addTo(map);
    }
  }
}

function reseter(e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}

// Zoom to Clicked Zoom Feature & Fill Name and Description Field
window.fncEditCell = function(argThis) {
  var rowNumber = argThis.parentNode.rowIndex;
  map.fitBounds(objectArray[rowNumber]);
  document.getElementById("trackNameView").value = nameArray[rowNumber];
  document.getElementById("trackBeschreibungView").innerHTML = descriptionArray[rowNumber];
};

// Change color of clicked table element
$('#tableDBTrackContents').on('click', '.clickable-row', function(event) {
  $(this).addClass('active').siblings().removeClass('active');
});

function parseMsToReadableTime(milliseconds){
  //Get hours from milliseconds
  var hours = milliseconds / (1000*60*60);
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

  //Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteMinutes = Math.floor(minutes);
  var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60;
  var absoluteSeconds = Math.floor(seconds);
  var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


  return h + ':' + m + ':' + s + " (hh:mm:ss)";
}

// Listen of new Element was added
document.getElementById('files').addEventListener('change', handleFileSelect, false);