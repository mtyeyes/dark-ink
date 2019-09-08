( function() {
  var classNames = ['no-js--remove', 'no-js--show', 'no-js--carousel'];
  for (var i=0; i < classNames.length; i++) {
    var listOfElements = document.querySelectorAll(('.'+ classNames[i]));
      for (var j=0; j<listOfElements.length; j++) {
        eval(listOfElements[j]).classList.remove(classNames[i]);
    }
  };
})();
