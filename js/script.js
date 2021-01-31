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

/*global customAlert*/
( function() {
  let links = document.querySelectorAll('a[href=""]');

  for (let link of links) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      customAlert.show('For now, only this page is available');
    });
  }
})();

( function() {
  class Carousel {
    constructor(obj) {
      this.name = obj['name'];
      this.container = document.querySelector(`.${this.name}__carousel`);
      this.list = this.container.querySelector(`.${this.name}__${obj['listName']}`);
      this.items = this.container.querySelectorAll(`.${this.name}__${obj['itemsName']}`);
      this.animationSpeed = obj['animationSpeed'];
      this.currentItem = 0;
      (obj['stopAtEdge']) ? this.stopAtEdge = true : this.stopAtEdge = false;
      (obj['resizeToFill']) ? this.resizeToFill = true : this.resizeToFill = false;
      this.itemsVisible = obj['itemsVisible'];
      this.refreshItems = () => {this.items = this.container.querySelectorAll(`.${this.name}__${obj['itemsName']}`)};
      this.swipeInformation = null;
      if (obj['hasRadioBtns']) {
        this.radioBtns = 0;
        this.radioBtnsContainer = document.querySelector(`.${this.name}__form`);
        this.refreshRadioBtns = () => {this.radioBtns = document.querySelectorAll(`.${this.name}__radio-btn`)};
        if (this['items'].length > this.itemsVisible()) {this.adjustRadioBtns(this)}
      }
      if(obj['hasNextPreviousBtns']) {
        this.btnPrevious = document.querySelector(`.${this.name}__btn--previous`);
        this.btnNext = document.querySelector(`.${this.name}__btn--next`);
      }
      if(obj['modalCarouselProperties']) {
        this.modalCarouselProperties = obj['modalCarouselProperties'];
      }
      if (Object.getPrototypeOf(this) === Carousel.prototype) {
        this.addEventListeners(this);
      }
      this.adjust();
    }
    addEventListeners (context) {
      this['container'].addEventListener('dragstart', function(event) {
        event.preventDefault();
      });
      this['container'].addEventListener('wheel', function(event) {
        context.scrollHandler(event);
      }, {passive: false});
      this['container'].addEventListener('mousedown', function(event) {
        let eventInformation = {x : event.screenX};
        context['swipeInformation'] = eventInformation;
        context.longPress = setTimeout(function() {context['swipeInformation'] = null }, 1000);
      });
      this['container'].addEventListener('touchstart', function(event) {
        let eventInformation = {x : event.changedTouches[0].screenX};
        context['swipeInformation'] = eventInformation;
        context.longPress = setTimeout(function() {context['swipeInformation'] = null }, 1000);
      }, {passive: true});
      window.addEventListener('resize', function() {
        if (context['currentItem'] + context.itemsVisible() >= context['items'].length) {
          context['currentItem'] = context['items'].length - context.itemsVisible();
        }
        if (typeof context['radioBtns'] !== 'undefined' && context['items'].length > context.itemsVisible()) {context.adjustRadioBtns(context)}
        context.adjust();
      });
      document.addEventListener('mouseup', function(event) {
        if (context['swipeInformation']) {
          context.swipe(event.screenX);
          clearTimeout(context.longPress);
        }
      });
      document.addEventListener('touchend', function(event) {
        if (context['swipeInformation']) {
          context.swipe(event.changedTouches[0].screenX);
          clearTimeout(context.longPress);
        }
      }, {passive: true});
      if (this['btnPrevious']) {this.addEventListenersToNextPreviousBtns(this)}
      if (this['modalCarouselProperties']) {this.addEventListenersToExpandCarousel(this)}
    }
    addEventListenersToNextPreviousBtns (context) {
      this['btnPrevious'].addEventListener('click', function() {
        context.slide('left');
      });
      this['btnNext'].addEventListener('click', function() {
        context.slide('right');
      });
    }
    addEventListenersToExpandCarousel (context) {
      this['items'].forEach(item => {
        item.addEventListener('click', function(event) {
          if (context['swipeInformation']) {
            context.showModalCarousel(event);
            context.swipeInformation = null;
          }
        });
      });
    }
    getScrollDirection (event) {
      if (event.deltaY < 0) {
        return 'right';
      } else {
        return 'left';
      }
    }
    scrollHandler (event) {
      if (this['items'].length > this.itemsVisible()) {
        event.stopPropagation();
        let direction = this.getScrollDirection(event);
        window.event.preventDefault();
        this.slide(direction);
      }
    }
    adjust () {
      if (this['items'].length === 0) {return}
      let itemWidth;
      let marginBetweenItems = +window.getComputedStyle(this['items'][0])['margin-right'].replace('px', '');
      if (this['resizeToFill']) {
        itemWidth = (document.body.clientWidth - (marginBetweenItems * (this.itemsVisible() - 1))) / this.itemsVisible();
        for (let item of this['items']) {
          item.style.width = itemWidth + 'px';
          item.style.height = itemWidth * 0.59 + 'px';
        }
      } else {
        itemWidth = this['items'][0].clientWidth;
      }
      this['stepWidth'] = itemWidth + marginBetweenItems;
      if (this['resizeToFill']) {this['list'].style.width = ((itemWidth + marginBetweenItems) * this['items'].length - marginBetweenItems) + 'px'}
      this['list'].style.transform = 'translateX(' + this['currentItem'] * this['stepWidth'] * -1 + 'px)';
      if (this['radioBtns']) {this.whichRadioBtnChecked()}
    }
    adjustRadioBtns (context) {
      let numberOfBtns = Math.ceil(this['items'].length / this.itemsVisible());
      if (numberOfBtns === this['radioBtns'].length) {return} else {this['radioBtnsContainer'].innerHTML = ''}
      let btn = document.createElement('input');
      btn.type = 'radio';
      btn.name = this['name'] + '-carousel';
      btn.className = this['name'] + '__radio-btn visually-hidden';
      let label = document.createElement('label');
      label.className = this['name'] + '__label';
      for (let i = 0; i < numberOfBtns; i++) {
        let newBtn = btn.cloneNode(true);
        let newLabel = label.cloneNode(true);
        newBtn.id = this['name'] + '-radio-' + i;
        newLabel.setAttribute('for', this['name'] + '-radio-' + i);
        newLabel.innerHTML = '<span class="visually-hidden">Button №' + (i + 1) + '<span>';
        this['radioBtnsContainer'].appendChild(newBtn);
        this['radioBtnsContainer'].appendChild(newLabel);
      }
      this.refreshRadioBtns();
      let labelsArr = document.querySelectorAll('.' + this['name'] + '__label');
      for (let i = 0; i < labelsArr.length; i++) {
        this['radioBtns'][i].oninput = () => {
          let position;
          (i !== labelsArr.length - 1) ? position = i * context.itemsVisible() : position = context['items'].length - context.itemsVisible();
          context.slideTo(position);
          context['radioBtns'][i].checked = true;
        };
      }
    }
    whichRadioBtnChecked () {
      let itemsVisible = this.itemsVisible();
      for (let i = 0; i < this['radioBtns'].length; i++) {
        if (this['currentItem'] <= itemsVisible * (i + 1) - 1 && this['currentItem'] > itemsVisible * i - 1) {this['radioBtns'][i].checked = true}
      }
      if (this['currentItem'] + 1 >=  itemsVisible * Math.floor(this['items'].length / itemsVisible)) {this['radioBtns'][(this['radioBtns'].length - 1)].checked = true}
    }
    freezeUntilAnimationend (context) {
      this['freeze'] = true;
      setTimeout(() => context['freeze'] = false, this['animationSpeed'] * 1.1);
    }
    slideStoppedAtEdge (direction, context) {
      (direction === 'right') ? this['currentItem']-- : this['currentItem']++;
      this['items'][this.currentItem].classList.add('carousel__current-item');
      if (this['items'].length <= this.itemsVisible()) {return}
      for (let item of this['items']) {item.classList.add('carousel__at-the-edge--' + direction)}
      setTimeout(() => {
        for (let item of context['items']) {item.classList.remove('carousel__at-the-edge--' + direction)}
      }, this['animationSpeed']);
    }
    slideBeyond (direction, context) {
      for (let item of this['items']) {item.classList.add('carousel__slide--' + direction)}
      if (direction === 'left') {
        this['list'].insertBefore(this['items'][(this['items'].length - 1)], this['items'][0]);
        this['currentItem'] = 0;
      } else {
        this['list'].insertBefore(this['items'][0], this['items'][this['items'].length]);
        this['currentItem'] = this['items'].length - this.itemsVisible();
      }
      setTimeout(() => {
        for (let item of context['items']) {item.classList.remove('carousel__slide--' + direction)}
      }, this['animationSpeed']);
      this.refreshItems();
      this['items'][this['currentItem']].classList.add('carousel__current-item');
      this.adjust();
    }
    slide (direction) {
      if (this['freeze']) { return }
      this.freezeUntilAnimationend(this);
      this['items'][this['currentItem']].classList.remove('carousel__current-item');
      if (direction === 'right') {this['currentItem']++} else {this['currentItem']--}
      const context = this;
      if (this['currentItem'] < 0) {
        (this['stopAtEdge']) ? this.slideStoppedAtEdge(direction, context) : this.slideBeyond(direction, context);
        return;
      } else if (this['currentItem'] > this['items'].length - this.itemsVisible()) {
        (this['stopAtEdge']) ? this.slideStoppedAtEdge(direction, context) : this.slideBeyond(direction, context);
        return;
      }
      this['items'][this['currentItem']].classList.add('carousel__current-item');
      this.adjust();
      if (this['radioBtns']) {this.whichRadioBtnChecked()}
      this['list'].style.transform = 'translateX(' + this['currentItem'] * this['stepWidth'] * -1 + 'px)';
    }
    slideTo (position) {
      this['currentItem'] = position;
      this.adjust();
    }
    swipe (newPointerCoordinatesX) {
      let pointerPath = newPointerCoordinatesX - this.swipeInformation.x;
      if (Math.abs(pointerPath) < 60) {return}
      (pointerPath < 0) ? this.slide('right') : this.slide('left');
      this.swipeInformation = null;
    }
    showModalCarousel (event) {
      if(!this['childCarousel']) {
        this['childCarousel'] = new ModalCarousel(this['modalCarouselProperties'], this);
      }
      this['childCarousel'].showModalCarousel(event);
    }
  }

  class ModalCarousel extends Carousel {
    constructor(obj, parentCarousel) {
      super(obj);
      this.parentCarousel = parentCarousel;
      this.filled = false;
      this.modalContainer = document.querySelector(`.${this.name}`);
      this.btnDownload = document.querySelector(`.${this.name}__btn--download`);
      this.btnCollapse = document.querySelector(`.${this.name}__btn--collapse`);
      this.btnClose = document.querySelector(`.${this.name}__btn--close`);
      this.imgCounter = document.querySelector(`.${this.name}__image-counter`);
      this.thumbnailsList = document.querySelector(`.${this.name}__thumbnails`);
      this.thumbnailsWrapper = document.querySelector(`.${this.name}__thumbnails-wrapper`);
      this.refreshThumbnails = () => {this.thumbnails = this.thumbnailsList.querySelectorAll(`.${this.name}__thumbnail`)};
      this.fillModalGallery();
      this.addEventListeners(this);
    }
    addEventListeners (context) {
      this['btnClose'].addEventListener('click', function() {
        context['modalContainer'].classList.remove('modal-gallery--show');
      });
      this['btnCollapse'].addEventListener('click', function() {
        context['thumbnailsWrapper'].classList.toggle('modal-gallery__thumbnails-wrapper--hide');
      });
      this['container'].addEventListener('dragstart', function(event) {
        event.preventDefault();
      });
      this['modalContainer'].addEventListener('wheel', function(event) {
        context.scrollHandler(event);
        context.synchronizeModalCarousel();
      }, {passive: false});
      this['container'].addEventListener('mousedown', function(event) {
        let eventInformation = {x : event.screenX};
        context['swipeInformation'] = eventInformation;
        context.longPress = setTimeout(function() {context.carouselCore[ 'swipeInformation'] = null }, 2500);
      });
      this['container'].addEventListener('touchstart', function(event) {
        let eventInformation = {x : event.changedTouches[0].screenX};
        context['swipeInformation'] = eventInformation;
        context.longPress = setTimeout(function() {context.carouselCore[ 'swipeInformation'] = null }, 2500);
      }, {passive: true});
      document.addEventListener('mouseup', function(event) {
        if (context['swipeInformation']) {
          context.swipe(event.screenX);
          context.synchronizeModalCarousel();
          clearTimeout(context['longPress']);
        }
      });
      document.addEventListener('touchend', function(event) {
        if (context['swipeInformation']) {
          context.swipe(event.changedTouches[0].screenX);
          context.synchronizeModalCarousel();
          clearTimeout(context['longPress']);
        }
      }, {passive: true});
      window.addEventListener('resize', function() {
        context.adjust();
        context.recalcMargin();
      });
      if (this['btnPrevious']) {this.addEventListenersToNextPreviousBtns(this)}
    }
    addEventListenersToNextPreviousBtns (context) {
      this['btnPrevious'].addEventListener('click', function() {
        context.slide('left');
        context.synchronizeModalCarousel();
      });
      this['btnNext'].addEventListener('click', function() {
        context.slide('right');
        context.synchronizeModalCarousel();
      });
    }
    copyImgsToCarousel (parentCarousel) {
      var list = document.createDocumentFragment();
      for (let i = 0; i < parentCarousel['items'].length; i++) {
        let galeryImg = parentCarousel['items'][i].querySelector('img');
        let imgWrapper = document.createElement('li');
        let elementWidth;
        (window.innerWidth >= 768) ? elementWidth = 320 : elementWidth = 160 ;
        imgWrapper.style.marginRight = Math.ceil(document.body.clientWidth / 2) - elementWidth + 'px';
        imgWrapper.className = 'modal-gallery__item';
        imgWrapper.dataset.id = parentCarousel['items'][i].dataset.id;
        let img = document.createElement('img');
        img.setAttribute('loading', 'lazy');
        img.className = 'modal-gallery__uncompressed-image';
        img.src = galeryImg.src.replace('[.][a-zA-Z]{3,4}', '-uc.jpg').replace('@2x', '');
        img.alt = galeryImg.alt;
        imgWrapper.appendChild(img);
        list.appendChild(imgWrapper);
      }
      this['list'].appendChild(list);
      this.refreshItems();
    }
    copyImgsToThumbnails (parentCarousel, context) {
      var list = document.createDocumentFragment();
      for (let i = 0; i < parentCarousel['items'].length; i++) {
        let elementToCopy;
        for (let item of parentCarousel['items']) {
          if (+item.dataset.id === i) {elementToCopy =  item}
        }
        let newElement = elementToCopy.cloneNode(true);
        newElement.classList.remove('gallery__image-wrapper');
        newElement.classList.add('modal-gallery__thumbnail');
        newElement.style.width = '';
        newElement.style.height = '';
        let newElementImg = newElement.querySelector('img');
        newElementImg.classList.remove('gallery__image');
        newElementImg.classList.add('modal-gallery__thumbnail-image');
        list.appendChild(newElement);
      }
      this.thumbnailsList.appendChild(list);
      this.refreshThumbnails();
      for (let item of this['thumbnails']) {
        item.addEventListener('click', function(event) {
          context.chooseImgOnThumbnail(event.currentTarget);
        });
      }
    }
    recalcMargin () {
      for (let item of this['items']) {
        let elementWidth;
        (window.innerWidth >= 768) ? elementWidth = 320 : elementWidth = 150 ;
        item.style.marginRight = Math.ceil(document.body.clientWidth / 2) - elementWidth + 'px';
      }
    }
    fillModalGallery () {
      this.copyImgsToCarousel(this['parentCarousel']);
      this.copyImgsToThumbnails(this['parentCarousel'], this);
    }
    slideToSelected (element, context) {
      for (let i = 0; i < this['items'].length; i++) {
        if (element.dataset.id === this['items'][i].dataset.id) {
          this['currentItem'] = i;
        }
      }
      this.synchronizeModalCarousel();
      window.requestAnimationFrame(function(){context.adjust()});
    }
    synchronizeModalCarousel () {
      for (let i = 0; i < this['items'].length; i++) {
        this['thumbnails'][i].classList.remove('modal-gallery__thumbnail--selected');
        if (this['items'][(this['currentItem'])].dataset.id === this['thumbnails'][i].dataset.id) {
          this['thumbnails'][i].classList.add('modal-gallery__thumbnail--selected');
        }
      }
      this['btnDownload'].href = this['items'][(this['currentItem'])].querySelector('img').src;
      this['imgCounter'].textContent = (+this['items'][this['currentItem']].dataset.id + 1) + '/' + this['items'].length;
      this.recalcMargin();
    }
    showModalCarousel (event) {
      this.slideToSelected(event.currentTarget, this);
      this['modalContainer'].classList.add(`${this['name']}--show`);
    }
    chooseImgOnThumbnail (element) {
      if (element.classList.contains('modal-gallery__thumbnail--selected')) {return}
      let selectedImg = element.dataset.id;
      for (let i = 0; i < this['items'].length; i++) {
        if (selectedImg === this['items'][i].dataset.id) {
          this.slideTo(i);
          this.synchronizeModalCarousel();
          return;
        }
      }
    }
  }

  const staffCarousel = {
    'name': 'staff',
    'listName': 'list',
    'itemsName': 'person',
    'hasNextPreviousBtns': false,
    'hasRadioBtns': true,
    'stopAtEdge': true,
    'resizeToFill' : false,
    'animationSpeed': 300,
    itemsVisible : function() {
      if (window.innerWidth >= 992) {
        return 3;
      } else if (window.innerWidth >= 768) {
        return 2;
      } else {
        return 1;
      }
    }
  };

  const reviewsCarousel = {
    'name': 'reviews',
    'listName': 'list',
    'itemsName': 'review',
    'hasNextPreviousBtns': false,
    'hasRadioBtns': true,
    'stopAtEdge': true,
    'resizeToFill': false,
    'animationSpeed': 300,
    itemsVisible : function() {
      if (window.innerWidth >= 768) {
        return 2;
      } else {
        return 1;
      }
    }
  };

  const galleryCarousel = {
    'name': 'gallery',
    'listName': 'images',
    'itemsName': 'image-wrapper',
    'hasNextPreviousBtns': true,
    'hasRadioBtns': false,
    'modalCarouselProperties': {
      'name': 'modal-gallery',
      'listName': 'list',
      'itemsName': 'item',
      'hasNextPreviousBtns': true,
      'hasRadioBtns': false,
      'stopAtEdge': false,
      'resizeToFill': false,
      'animationSpeed': 300,
      itemsVisible : function() {
        return 1;
      }
    },
    'stopAtEdge': false,
    'resizeToFill': true,
    'animationSpeed': 300,
    itemsVisible : function() {
      if (window.innerWidth >= 700) {
        return 3;
      } else if (window.innerWidth >= 520) {
        return 2;
      } else {
        return 1;
      }
    }
  };

  const carouselsList = [staffCarousel, reviewsCarousel, galleryCarousel];

  carouselsList.forEach(carousel => new Carousel(carousel));

})();

const customAlert = {
  modalAlert : document.querySelector('.modal-alert'),
  modalText : document.querySelector('.modal-alert__text'),
  show : function(message) {
    this.modalText.textContent = message;
    this.modalAlert.classList.add('modal-alert--show');
  },
  hide : function() {
    this.modalAlert.classList.remove('modal-alert--show');
  }
};

document.querySelector('.modal-alert__close-btn').addEventListener('click', function() {
  customAlert.hide();
});

/*global customAlert*/
( function() {
  let inputsArray = document.querySelectorAll('.form__input');
  let submitBtn = document.querySelector('.form__btn');

  for (let input of inputsArray) {
    input.addEventListener('blur', function() {
      input.classList.add('form__input--changed');
    });
  }

  submitBtn.addEventListener('click', function( event ) {
    event.preventDefault();
    for (let input of inputsArray) {
      if (input.required === true) {
        if(!input.checkValidity()) {
          customAlert.show('Form is not filled correctly');
          for (let input of inputsArray) {input.classList.add('form__input--changed')}
          return;
        }
      }
    }
    customAlert.show('We will contact you as soon as possible!');
    for (let input of inputsArray) {
      input.value = '';
    }
  });
}());

( function() {
  const loadMap = () => {
    let googleMap = document.createElement('script');
    googleMap.src = 'js/map-custom-colors.js';
    googleMap.type = 'text/javascript';
    document.body.appendChild(googleMap);
  };
  const mapContainer = document.querySelector('.map');
  const getMapOffsetToViewport = () => {return mapContainer.getBoundingClientRect().top};
  const getViewportHeight = () => {return window.innerHeight};
  const checkIfMapShouldBeLoaded = () => {
    if(getMapOffsetToViewport() < getViewportHeight() * 2) {
      loadMap();
      window.removeEventListener('scroll', checkIfMapShouldBeLoaded);
      window.addEventListener('resize', checkIfMapShouldBeLoaded);
    }
  };

  window.addEventListener('scroll', checkIfMapShouldBeLoaded);
  window.addEventListener('resize', checkIfMapShouldBeLoaded);
})();

( function() {
  let menuToggleBtn = document.querySelector('.site-nav__menu-toggle');
  let menu = document.querySelector('.site-nav__list');
  let subMenuToggleBtns = document.querySelectorAll('.site-nav__sub-menu-toggle');
  let subMenus = document.querySelectorAll('.site-nav__sub-menu');

  menuToggleBtn.addEventListener('click', function(){
    menuToggleBtn.classList.toggle('site-nav__menu-toggle--toggled');
    menu.classList.toggle('site-nav__list--open');
  });

  for (let i = 0; i < subMenus.length; i++) {
    let currentBtn = subMenuToggleBtns[i];
    let currentMenu = subMenus[i];
    currentBtn.addEventListener('click', function() {
      currentBtn.classList.toggle('site-nav__sub-menu-toggle--toggled');
      currentMenu.classList.toggle('site-nav__sub-menu--open');
    });
  }
})();

( function() {
  const classNames = ['no-js--remove'];
  for (let className of classNames) {
    let arrayOfElements = document.querySelectorAll('.'+ className);
    for (let element of arrayOfElements) {
      element.classList.remove(className);
    }
  }
}());

( function() {
  const header = document.querySelector('.header');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  const imageContainer = document.querySelector('.about__pictures-container');
  const imageLeft = document.querySelector('.about__img--left');
  const imageRight = document.querySelector('.about__img--right');

  const parallax = () => {
    let maxOffset = 15;
    let parallaxSpread = 2 * imageContainer.clientHeight;
    let parallaxStart = 1.8 * imageContainer.clientHeight;
    let scrollDistance = imageContainer.getBoundingClientRect()['y'] || imageContainer.getBoundingClientRect()['top'];
    let progress = (parallaxStart - scrollDistance) / parallaxSpread;
    let yOffset;
    if (progress < 0) {
      yOffset = 0;
    } else if (progress > 1) {
      yOffset = maxOffset;
    } else {
      yOffset = progress * maxOffset;
    }
    imageLeft.style.transform = 'translateY(' + (yOffset * -1) + '%)';
    imageRight.style.transform = 'translateY(' + yOffset + '%)';
  };

  const scrollToTop = () => {
    if (window.scrollTo) {
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      const position = document.body.scrollTop || document.documentElement.scrollTop;
      if (position) {
        window.scrollBy(0, -200);
        window.requestAnimationFrame(scrollToTop);
      }
    }
  };

  scrollToTopBtn.removeAttribute('href');
  scrollToTopBtn.addEventListener('click', function(event) {
    event.preventDefault;
    scrollToTop();
  });

  document.addEventListener('scroll', function() {
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
