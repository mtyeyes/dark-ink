( function() {
  const loadMap = () => {
    let googleMap = document.createElement("script");
    googleMap.src = 'js/map-custom-colors.js';
    googleMap.type = "text/javascript";
    document.body.appendChild(googleMap);
  }

  window.addEventListener('load', function(event) {
    setTimeout(loadMap, 1000);
  });
})();
