var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var csv = '';
var sep = ";";
var lsep = "\n";
var flag = 0;

function initialize() {
  directionsDisplay1 = new google.maps.DirectionsRenderer();
  directionsDisplay2 = new google.maps.DirectionsRenderer();
  directionsDisplay3 = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(22, 83);
  var mapOptions = {
    zoom:5,
    center: chicago
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay1.setMap(map)

  var control = document.getElementById('control');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
}

function newStep(startLat, startLng, endLat, endLng, encodeString, stepDis) {
	var dy = endLat - startLat;
	var dx = endLng - startLng;
	var headsign = 0;

	if ( dx > 0 && dy >= 0 ) {
		headsign = 1;
	} else if ( dx <= 0 && dy > 0 ) {
		headsign = 2;
	} else if ( dx < 0 && dy <= 0 ) {
		headsign = 3;
	} else if ( dx >= 0 && dy < 0 ) {
		headsign = 4;
	}
	var newStep = {
		"start_lat" : startLat,
		"start_lng" : startLng,
		"end_lat" : endLat,
		"end_lng" : endLng,
		"enc_path" : encodeString,
		"distance" : stepDis,
		"headsign" : headsign
	}
	// Use AJAX to post the object to our adduser service
		$.ajax({
		    type: 'POST',
		    data: newStep,
		    url: '/addstep',
		    dataType: 'JSON'
		}).done(function( data ) {
			
		});
}

var generateUid = function (separator) {
    /// <summary>
    ///    Creates a unique id for identification purposes.
    /// </summary>
    /// <param name="separator" type="String" optional="true">
    /// The optional separator for grouping the generated segmants: default "-".    
    /// </param>

    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
};

function addRoads(startLat, startLng, midLatLng, endLat, endLng, encodeString, stepDis, headsign, errFlag, roadID, isRel)
{
	if (errFlag == 0) {
		if(roadID) {
			var newStep = {
				"start_lat" : startLat,
				"start_lng" : startLng,
				"end_lat" : endLat,
				"end_lng" : endLng,
				"enc_path" : encodeString,
				"mid_path" : midLatLng,
				"distance" : stepDis,
				"headsign" : headsign,
				"is_rel" : isRel,
				"road_id" : roadID
			}

			$.ajax({
			    type: 'POST',
			    data: newStep,
			    url: '/addstep',
			    dataType: 'JSON'
			}).done(function( data ) {
				$.each(data, function(){

				});
			});
		} else if(stepDis < 100000) {
			genRoadID = generateUid();
			var newRoad = {
				"_id" : genRoadID,
				"start_lat" : startLat,
				"start_lng" : startLng,
				"end_lat" : endLat,
				"end_lng" : endLng,
				"headsign" : headsign
			}
			$.ajax({
			    type: 'POST',
			    data: newRoad,
			    url: '/addroad',
			    dataType: 'JSON'
			}).done(function( data ) {
				$.each(data, function(){
				});
			});

			var newStep = {
				"start_lat" : startLat,
				"start_lng" : startLng,
				"end_lat" : endLat,
				"end_lng" : endLng,
				"enc_path" : encodeString,
				"mid_path" : midLatLng,
				"distance" : stepDis,
				"headsign" : headsign,
				"is_rel" : 0,
				"road_id" : genRoadID
			}

			$.ajax({
			    type: 'POST',
			    data: newStep,
			    url: '/addstep',
			    dataType: 'JSON'
			}).done(function( data ) {
				$.each(data, function(){
				});
			});
		} else {
			genRelID = generateUid();
			var newRoad = {
				"_id" : genRelID,
				"start_lat" : startLat,
				"start_lng" : startLng,
				"end_lat" : endLat,
				"end_lng" : endLng,
				"headsign" : headsign
			}
			$.ajax({
			    type: 'POST',
			    data: newRoad,
			    url: '/addrel',
			    dataType: 'JSON'
			}).done(function( data ) {
				$.each(data, function(){
				});
			});

			var newStep = {
				"start_lat" : startLat,
				"start_lng" : startLng,
				"end_lat" : endLat,
				"end_lng" : endLng,
				"enc_path" : encodeString,
				"mid_path" : midLatLng,
				"distance" : stepDis,
				"headsign" : headsign,
				"is_rel" : 1,
				"road_id" : genRelID
			}

			$.ajax({
			    type: 'POST',
			    data: newStep,
			    url: '/addstep',
			    dataType: 'JSON'
			}).done(function( data ) {
				$.each(data, function(){
				});
			});
		}
	}
}

function addStep(startLat, startLng, midLatLng, endLat, endLng, encodeString, stepDis) {

	var dy = endLat - startLat;
	var dx = endLng - startLng;
	var headsign = 0;

	if ( dx > 0 && dy >= 0 ) {
		headsign = 1;
	} else if ( dx <= 0 && dy > 0 ) {
		headsign = 2;
	} else if ( dx < 0 && dy <= 0 ) {
		headsign = 3;
	} else if ( dx >= 0 && dy < 0 ) {
		headsign = 4;
	}
	var startLatMin = startLat - 0.2;
	var startLatMax = startLat + 0.2;
	var startLngMin = startLng - 0.2;
	var startLngMax = startLng + 0.2;
	
	var endLatMin = endLat - 0.2;
	var endLatMax = endLat + 0.2;
	var endLngMin = endLng - 0.2;
	var endLngMax = endLng + 0.2;

	var startLatLngMin = new google.maps.LatLng(startLatMin,startLngMin);
	var startLatLngMax = new google.maps.LatLng(startLatMax,startLngMax);
	var endLatLngMin = new google.maps.LatLng(endLatMin,endLngMin);
	var endLatLngMax = new google.maps.LatLng(endLatMax,endLngMax);
	var startLatMinS = startLatLngMin.lat();
	var startLngMinS = startLatLngMin.lng();
	var startLatMaxS = startLatLngMax.lat();
	var startLngMaxS = startLatLngMax.lng();
	var endLatMinS = endLatLngMin.lat();
	var endLngMinS = endLatLngMin.lng();
	var endLatMaxS = endLatLngMax.lat();
	var endLngMaxS = endLatLngMax.lng();

	var roadID = 0;
	var errFlag = 0;
	var isRel = 0;
	// If it is, compile all user info into one object
	var searchStep = {
		"start_lat_min" : startLatMinS,
		"start_lng_min" : startLngMinS,
		"start_lat_max" : startLatMaxS,
		"start_lng_max" : startLngMaxS,
		"end_lat_min" : endLatMinS,
		"end_lng_min" : endLngMinS,
		"end_lat_max" : endLatMaxS,
		"end_lng_max" : endLngMaxS,
		"start_lat" : startLat,
		"start_lng" : startLng,
		"end_lat" : endLat,
		"end_lng" : endLng,
		"mid_path" : midLatLng,
		"distance" : stepDis,
		"headsign" : headsign
	}
	// Use AJAX to post the object to our adduser service
	$.ajax({
	    type: 'POST',
	    data: searchStep,
	    url: '/stepentry',
	    dataType: 'JSON'
	}).done(function( data ) {
		var count = 0;
		$.each(data, function(){
			count++;
			if (roadID == 0) {
				isRel = this.is_rel;
				roadID = this.road_id;
			} else {
				if (roadID != this.road_id) {
					console.log("Error in %s %s", roadID, this.road_id);
					errFlag = 1;
				}
			}
		});
		addRoads(startLat, startLng, midLatLng, endLat, endLng, encodeString, stepDis, headsign, errFlag, roadID, isRel);
	});
};

function getInfoEncodedPath(startLat, startLng) {
	startLat = Math.round(startLat * 100000) / 100000;
	startLng = Math.round(startLng * 100000) / 100000;
	var step = {
		"end_lat": startLat,
		"end_lng": startLng
	}
	// Use AJAX to post the object to our adduser service
	$.ajax({
	    type: 'GET',
	    data: step,
	    url: '/stepnode',
	    dataType: 'JSON'
	}).done(function( response ) {
	
	    // Check for successful (blank) response
	    if (response.msg === '') {
	
	    }
	    else {
	
	    }
	});

	$.getJSON( '/stepnode', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
        });

    });


	
}
function createInfoWindow(poly) {
	var infowindow = new google.maps.InfoWindow({
	      content: "Clicked" 
	});
    google.maps.event.addListener(poly, 'click', function(event) {
	var path = poly.getPath().getArray();
	var startLat = path[0].lat();
	var startLng = path[0].lng();
	var marker = new google.maps.Marker({
	      position: event.latLng,
		map: map,
		opacity: 1
	  });
	infowindow.open(map,marker);
	getInfoEncodedPath(startLat, startLng);
    });
}

function searchLat() {
  var searchLat = document.getElementById('searchLat').value;

	var step = {
		"start_lat": searchLat
	}

	$.ajax({
	    type: 'POST',
	    data: step,
	    url: '/stepentry',
	    dataType: 'JSON'
	}).done(function( data ) {
		$.each(data, function(){
			showPoly(this.enc_path);
			var marker = new google.maps.Marker({
			      position: {lat: this.start_lat, lng: this.start_lng},
			      map: map,
			  });
		});
	});
}

function showPoly(encoded) {
	var decodedPath0 = google.maps.geometry.encoding.decodePath(encoded);
	setRegion0 = new google.maps.Polyline({
		path: decodedPath0,
		strokeColor: "#FF2200",
		strokeOpacity: 1.0,
		strokeWeight: 2,
		map: map
	});
	createInfoWindow(setRegion0);
	
}

function populateMap() {

    // Empty content string

    // jQuery AJAX call for JSON
    $.getJSON( '/steplist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
	    encodedPoly = this.enc_path;
	    showPoly(encodedPoly);
        });

    });
};

function wrapper(legno, start, end) {
		var n = legno;
		setTimeout(function() {
		calcRoute(start, end);
		}, (n-1) * 2500);
}

function calcRoute(start, end) {
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
      avoidHighways: false
  };
  var csvPanel = document.getElementById('directions-panel');
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
	for (var p = 0; p < response.routes.length; p++) {
	var leg = response.routes[p].legs[0];
     	var summaryPanel = document.getElementById('ratings-panel');
	summaryPanel.innerHTML = '';
	var legseg = 0;
	for (var i = 0; i < leg.steps.length; i++) {
		var routeSegment = i + 1;
		if (leg.steps[i].distance.value > 10000) {
			legseg++;
			var startLat = leg.steps[i].start_location.lat();;
			var startLng = leg.steps[i].start_location.lng();;
			var endLat = leg.steps[i].end_location.lat();;
			var endLng = leg.steps[i].end_location.lng();;
			var stepDis = leg.steps[i].distance.value;
			var path = leg.steps[i].path;
			var encodeString = google.maps.geometry.encoding.encodePath(path);
			var midLatLng = [];
			var mid = Math.ceil(path.length/2);
			var midMin = mid - 30;
			var midMax = mid + 30;
			var j = 0;
			for(var k = midMin; k < midMax; k++) {
				midLatLng[j] = path[k].toUrlValue();
				j++;
			}
			addStep(startLat, startLng, midLatLng, endLat, endLng, encodeString, stepDis);
			summaryPanel.innerHTML += legseg + startLat + endLat + '<br>';
		}
	}
	}
    } else {
		alert("Exceeded");
	}
  });
}

function startPopulate() {
	var count = 0;
	$.getJSON( '/highlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
		wrapper(count,this.start, this.end);
		count++;
        });

    });
	alert("It's over");
}

function calcOneRoute() {
	var start = document.getElementById('start').value;
  	var end = document.getElementById('end').value;
	calcRoute(start, end);
}

google.maps.event.addDomListener(window, 'load', initialize);
