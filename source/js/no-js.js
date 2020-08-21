( function() {
  const classNames = ['no-js--remove'];
  for (let className of classNames) {
    let arrayOfElements = document.querySelectorAll('.'+ className);
    for (let element of arrayOfElements) {
      element.classList.remove(className);
    }
  }
}());
