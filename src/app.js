var map;
var infowindow;

function initMap() {
  var addressQuery = $('#addressQuery').val();
  var radiusQuery = $('#radiusQuery').val();
  var filters = $('.filter-checkbox');
  var filterQuery = []
  for (i = 0; i <= filters.length; i++) {
    var f = $(filters[i]);
    if (f.prop('checked')) {
      filterQuery.push(f.prop('id'))
    }
  }

  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': addressQuery}, function(results, status) {
    var targetLocation = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    }

    map = new google.maps.Map(document.getElementById('map'), {
      center: targetLocation,
      zoom: 15,
    });
    var targetMarker = new google.maps.Marker({
      map: map,
      position: targetLocation,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: targetLocation,
      radius: radiusQuery,
      types: filterQuery,
    }, callback);
  });
}


function callback(results, status) {
  var resultList = $('#resultList');
  resultList.empty()
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      resultList.append('<li>' + results[i].name + '(' + results[i].vicinity + ')</li>');
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

var searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = initMap
