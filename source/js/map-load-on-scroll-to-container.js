( function() {
  const loadMap = () => {
    let googleMap = document.createElement("script");
    googleMap.src = 'js/map-custom-colors.js';
    googleMap.type = "text/javascript";
    document.body.appendChild(googleMap);
  }
  const mapContainer = document.querySelector('.map');
  const getMapOffsetToViewport = () => {return mapContainer.getBoundingClientRect().top}
  const getViewportHeight = () => {return window.innerHeight};
  const checkIfMapShouldBeLoaded = () => {
    if(getMapOffsetToViewport() < getViewportHeight() * 2) {
      loadMap();
      window.removeEventListener('scroll', checkIfMapShouldBeLoaded);
      window.addEventListener('resize', checkIfMapShouldBeLoaded);
    }
  }

  window.addEventListener('scroll', checkIfMapShouldBeLoaded);
  window.addEventListener('resize', checkIfMapShouldBeLoaded);
})();
