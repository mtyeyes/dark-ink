(function () {
  const header = document.querySelector('.header');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  const imageContainer = document.querySelector('.about__pictures-container');
  const imageLeft = document.querySelector('.about__img--left');
  const imageRight = document.querySelector('.about__img--right');

  const parallax = () => {
    let maxOffset = 15;
    let parallaxSpread = 2 * imageContainer.clientHeight;
    let parallaxStart = 1.8 * imageContainer.clientHeight;
    let scrollDistance =
      imageContainer.getBoundingClientRect()['y'] ||
      imageContainer.getBoundingClientRect()['top'];
    let progress = (parallaxStart - scrollDistance) / parallaxSpread;
    let yOffset;
    if (progress < 0) {
      yOffset = 0;
    } else if (progress > 1) {
      yOffset = maxOffset;
    } else {
      yOffset = progress * maxOffset;
    }
    imageLeft.style.transform = 'translateY(' + yOffset * -1 + '%)';
    imageRight.style.transform = 'translateY(' + yOffset + '%)';
  };

  const scrollToTop = () => {
    if (window.scrollTo) {
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      const position =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (position) {
        window.scrollBy(0, -200);
        window.requestAnimationFrame(scrollToTop);
      }
    }
  };

  scrollToTopBtn.removeAttribute('href');
  scrollToTopBtn.addEventListener('click', function (event) {
    event.preventDefault;
    scrollToTop();
  });

  document.addEventListener('scroll', function () {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      header.classList.add('header--sticky');
      scrollToTopBtn.classList.add('scroll-to-top--show');
    } else {
      header.classList.remove('header--sticky');
      scrollToTopBtn.classList.remove('scroll-to-top--show');
    }
    parallax();
  });
})();
