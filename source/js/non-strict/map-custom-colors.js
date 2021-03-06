function initMap() {
  var geocoder = new google.maps.Geocoder();
  var address = '1401 W 6th St, Los Angeles, CA 90017, USA';
  var map = new google.maps.Map(document.querySelector('.map__interactive'), {
    center: { lat: 34.056, lng: -118.267 },
    zoom: 15,
    disableDefaultUI: true,
    styles: [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#212121',
          },
        ],
      },
      {
        elementType: 'labels',
        stylers: [
          {
            color: '#666666',
          },
          {
            weight: 0.5,
          },
        ],
      },
      {
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        elementType: 'labels.text',
        stylers: [
          {
            color: '#666666',
          },
        ],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#666666',
          },
        ],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#212121',
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#9e9e9e',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#bdbdbd',
          },
        ],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#212121',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#181818',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1b1b1b',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2e2e2e',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          {
            color: '#666666',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8a8a8a',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#373737',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2e2e2e',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#3c3c3c',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2e2e2e',
          },
        ],
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: '#4e4e4e',
          },
        ],
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2e2e2e',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2e2e2e',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161',
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#000000',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#3d3d3d',
          },
        ],
      },
    ],
  });

  (function codeAddress(geocoder, map) {
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
      }
    });
  })(geocoder, map);
}

(function () {
  var apiKey = document.createElement('script');
  var apiKeyEncodedParts = [
    '9Cy34_',
    'Tqe-oq0',
    'PWubln4g',
    'mre2rlMQm',
    'AIzaSyBkE',
  ];
  apiKey.src =
    'https://maps.googleapis.com/maps/api/js?key=' +
    (apiKeyEncodedParts[4] +
      apiKeyEncodedParts[1] +
      apiKeyEncodedParts[0] +
      apiKeyEncodedParts[3] +
      apiKeyEncodedParts[2]) +
    '&callback=initMap';
  apiKey.type = 'text/javascript';
  apiKey.setAttribute('defer', 'defer');
  document.body.appendChild(apiKey);
})();
