/*global customAlert*/
(function () {
  let links = document.querySelectorAll('a[href=""]');

  for (let link of links) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      customAlert.show('For now, only this page is available');
    });
  }
})();
