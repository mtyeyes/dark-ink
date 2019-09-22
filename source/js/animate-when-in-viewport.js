( function() {
  if ('IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    let animatedElements = document.querySelectorAll('.fade-in-up');
    let animatedPseudoElements = document.querySelectorAll('.animated-pseudo-element');
    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          if (entry.target.classList.contains('hidden-before-animation')) {
            entry.target.classList.remove('hidden-before-animation');
            entry.target.classList.add('fade-in-up');
          } else if (entry.target.classList.contains('hide-pseudo-element')) {
            entry.target.classList.remove('hide-pseudo-element');
            entry.target.classList.add('animated-pseudo-element');
          }
          observer.unobserve(entry.target);
        }
      });
    });

    for (let i = 0; i < animatedElements.length; i++) {
      animatedElements[i].classList.remove('fade-in-up');
      animatedElements[i].classList.add('hidden-before-animation');
      observer.observe(animatedElements[i]);
    }

    for (let i = 0; i < animatedPseudoElements.length; i++) {
      animatedPseudoElements[i].classList.remove('animated-pseudo-element');
      animatedPseudoElements[i].classList.add('hide-pseudo-element');
      observer.observe(animatedPseudoElements[i]);
    }
  }
}());
