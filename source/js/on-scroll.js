( function() {
  var header = document.querySelector('header');
  var imageLeft = document.querySelector('.about__img--left');
  var imageRight = document.querySelector('.about__img--right');
  document.addEventListener('scroll', function(event) {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      header.classList.add('header--sticky');
    } else {
      header.classList.remove('header--sticky');
    }
  })
})()
