  const carouselCore = {
    getScrollDirection : function(event) {
      if (event.deltaY < 0) {
        return 'right';
      } else {
        return 'left';
      }
    },
    scrollHandler : function (event, block) {
      if (block['items'].length > block.itemsVisible()) {
        event.stopPropagation();
        let direction = this.getScrollDirection(event);
        window.event.preventDefault();
        this.slide(block, direction);
      }
    },
    adjust : function (block) {
      let itemWidth;
      if (block['resizeToFill']) {
        itemWidth = window.innerWidth / block.itemsVisible();
        for (let item of block['items']) {
          item.style.width = itemWidth + 'px';
          item.style.height = itemWidth * 0.59 + 'px';
        }
      } else {
        itemWidth = block['items'][0].clientWidth;
      }
      let marginBetweenItems = +window.getComputedStyle(block['items'][0])['margin-right'].replace('px', '');
      block['stepWidth'] = itemWidth + marginBetweenItems;
      if (block['resizeToFill']) {block['list'].style.width = ((itemWidth + marginBetweenItems) * block['items'].length - marginBetweenItems) + 'px';}
      block['list'].style.transform = 'translateX(' + block['currentItem'] * block['stepWidth'] * -1 + 'px)';
      if (block['radioBtns']) {this.whichRadioBtnChecked(block)};
    },
    adjustRadioBtns : function (block) {
      let numberOfBtns = Math.ceil(block['items'].length / block.itemsVisible());
      if (numberOfBtns === block['radioBtns'].length) {return} else {block['radioBtnsContainer'].innerHTML = ''};
      let btn = document.createElement('input');
      btn.type = 'radio';
      btn.name = block['name'] + '-carousel';
      btn.className = block['name'] + '__radio-btn visually-hidden';
      let label = document.createElement('label');
      label.className = block['name'] + '__label';
      for (let i = 0; i < numberOfBtns; i++) {
        let newBtn = btn.cloneNode(true);
        let newLabel = label.cloneNode(true);
        newBtn.id = block['name'] + '-radio-' + i;
        newLabel.setAttribute('for', block['name'] + '-radio-' + i);
        newLabel.innerHTML = '<span class="visually-hidden">Button №' + (i + 1) + '<span>';
        block['radioBtnsContainer'].appendChild(newBtn);
        block['radioBtnsContainer'].appendChild(newLabel);
      }
      block.refreshRadioBtns();
      let labelsArr = document.querySelectorAll('.' + block['name'] + '__label')
      for (let i = 0; i < labelsArr.length; i++) {
        block['radioBtns'][i].addEventListener ('input', function(event) {
          let position;
          (i !== labelsArr.length - 1) ? position = i * block.itemsVisible() : position = block['items'].length - block.itemsVisible();
          carouselCore.slideTo(block, position);
          block['radioBtns'][i].checked = true;
        });
      }
    },
    whichRadioBtnChecked : function (block) {
      let itemsVisible = block.itemsVisible()
      for (let i = 0; i < block['radioBtns'].length; i++) {
        if (block['currentItem'] <= itemsVisible * (i + 1) - 1 && block['currentItem'] > itemsVisible * i - 1) {block['radioBtns'][i].checked = true};
      }
      if (block['currentItem'] + 1 >=  itemsVisible * Math.floor(block['items'].length / itemsVisible)) {block['radioBtns'][(block['radioBtns'].length - 1)].checked = true};
    },
    slideStoppedAtEdge : function (block, direction) {
      block['freeze'] = true;
      (direction === 'right') ? block['currentItem']-- : block['currentItem']++;
      block['items'][block.currentItem].classList.add('carousel__current-item');
      for (let item of block['items']) {item.classList.add('carousel__at-the-edge--' + direction)}
      block['items'][1].addEventListener ('animationend', function(event) {
        for (let item of block['items']) {item.classList.remove('carousel__at-the-edge--' + direction)}
        block['freeze'] = false;
      });
    },
    slideBeyond : function (block, direction) {
      block['freeze'] = true;
      for (let item of block['items']) {item.classList.add('carousel__slide--' + direction)}
      if (direction === 'left') {
        block['list'].insertBefore(block['items'][(block['items'].length - 1)], block['items'][0]);
        block['currentItem'] = 0;
      } else {
        block['list'].insertBefore(block['items'][0], block['items'][block['items'].length]);
        block['currentItem'] = block['items'].length - block.itemsVisible();
      }
      block['items'][1].addEventListener ('animationend', function(event) {
        for (let item of block['items']) {item.classList.remove('carousel__slide--' + direction)}
        block['freeze'] = false;
      });
      block.refreshItems();
      block['items'][block.currentItem].classList.add('carousel__current-item');
      this.adjust(block);
    },
    slide : function (block, direction) {
      block['items'][block['currentItem']].classList.remove('carousel__current-item');
      if (block['freeze']) { return };
      if (direction === 'right') {block['currentItem']++;} else {block['currentItem']--;}
      if (block['currentItem'] < 0) {
        (block['stopAtEdge']) ? this.slideStoppedAtEdge(block, direction) : this.slideBeyond(block, direction);
        return
      } else if (block['currentItem'] > block['items'].length - block.itemsVisible()) {
        (block['stopAtEdge']) ? this.slideStoppedAtEdge(block, direction) : this.slideBeyond(block, direction);
        return;
      }
      block['items'][block['currentItem']].classList.add('carousel__current-item');
      this.adjust(block);
      if (block['radioBtns']) {this.whichRadioBtnChecked(block)};
      block['list'].style.transform = 'translateX(' + block['currentItem'] * block['stepWidth'] * -1 + 'px)';
    },
    slideTo : function (block, position) {
      block['currentItem'] = position;
      this.adjust(block);
    },
    swipe : function (newPointerCoordinatesX, newPointerCoordinatesY) {
      let block = this.swipeInformation.calledFrom;
      if (!block || !block['swipe']) {return}
      let pointerPath;
      (block['swipe'] === 'horizontal') ? pointerPath = newPointerCoordinatesX - this.swipeInformation.x : pointerPath = newPointerCoordinatesY - this.swipeInformation.y;
      this.swipeInformation = {};
      if (Math.abs(pointerPath) < 80) {return}
      (pointerPath < 0) ? this.slide(block, 'right') : this.slide(block, 'left');
    },
    swipeInformation : {}
  }
  const staffCarousel = {
    'name' : 'staff',
    'container' : document.querySelector('.staff__carousel'),
    'list' : document.querySelector('.staff__list'),
    'items' : document.querySelectorAll('.staff__person'),
    'radioBtns' : 0,
    'radioBtnsContainer' : document.querySelector('.staff__form'),
    'currentItem' : 0,
    'stopAtEdge' : true,
    'resizeToFill' : false,
    'swipe' : 'horizontal',
    itemsVisible : function() {
      if (window.innerWidth >= 992) {
        return 3;
      } else if (window.innerWidth >= 768) {
        return 2;
      } else {
        return 1;
      }
    },
    refreshRadioBtns : function () {
      this.radioBtns = document.querySelectorAll('.staff__radio-btn');
    },
    refreshItems : function() {
      this.items = document.querySelectorAll('.staff__person');
    }
  };
  const reviewsCarousel = {
    'name' : 'reviews',
    'container' : document.querySelector('.reviews__carousel'),
    'list' : document.querySelector('.reviews__list'),
    'items' : document.querySelectorAll('.reviews__review'),
    'radioBtns' : 0,
    'radioBtnsContainer' : document.querySelector('.reviews__form'),
    'currentItem' : 0,
    'stopAtEdge' : true,
    'resizeToFill' : false,
    'swipe' : 'horizontal',
    itemsVisible : function() {
      if (window.innerWidth >= 768) {
        return 2;
      } else {
        return 1;
      }
    },
    refreshRadioBtns : function () {
      this.radioBtns = document.querySelectorAll('.reviews__radio-btn');
    },
    refreshItems : function() {
      this.items = document.querySelectorAll('.reviews__review');
    }
  };
  const galleryCarousel = {
    'container' : document.querySelector('.gallery__container'),
    'list' : document.querySelector('.gallery__images'),
    'items' : document.querySelectorAll('.gallery__image-wrapper'),
    'btnLeft' : document.querySelector('.gallery__btn--previous'),
    'btnRight' : document.querySelector('.gallery__btn--next'),
    'currentItem' : 0,
    'stopAtEdge' : false,
    'resizeToFill' : true,
    'swipe' : 'horizontal',
    itemsVisible : function() {
      if (window.innerWidth >= 700) {
        return 3;
      } else if (window.innerWidth >= 520) {
        return 2;
      } else {
        return 1;
      }
    },
    refreshItems : function() {
      this.items = document.querySelectorAll('.gallery__image-wrapper');
    }
  };
  const modalgalleryCarousel = {
    'uncompressedImg' : document.querySelector('.modal-gallery__uncompressed-image'),
    'container' : document.querySelector('.modal-gallery__carousel'),
    'list' : document.querySelector('.modal-gallery__list'),
    'items' : document.querySelectorAll('.modal-gallery__image-wrapper'),
    'btnLeft' : document.querySelector('.modal-gallery__btn--previous'),
    'btnRight' : document.querySelector('.modal-gallery__btn--next'),
    'currentItem' : 0,
    'stopAtEdge' : false,
    'resizeToFill' : false,
    'swipe' : 'horizontal',
    itemsVisible : function() {
      return 5;
    },
    refreshItems : function() {
      this.items = document.querySelectorAll('.gallery__image-wrapper');
    }
  };

  const carouselsArr = [staffCarousel, reviewsCarousel, galleryCarousel];

  window.addEventListener('resize', function(event) {
    for (let obj of carouselsArr) {
      if (obj['currentItem'] + obj.itemsVisible() >= obj['items'].length) {
        obj['currentItem'] = obj['items'].length - obj.itemsVisible();
      }

      if (typeof obj['radioBtns'] !== 'undefined' && obj['items'].length > obj.itemsVisible()) {carouselCore.adjustRadioBtns(obj)};

      carouselCore.adjust(obj);
    }
  });

  for (let obj of carouselsArr) {
    obj['container'].addEventListener('dragstart', function(event) {
      event.preventDefault();
    });

    if (typeof obj['radioBtns'] !== 'undefined' && obj['items'].length > obj.itemsVisible()) {carouselCore.adjustRadioBtns(obj)};

    if (obj['btnLeft']) {
      obj['btnLeft'].addEventListener('click', function(event) {
        carouselCore.slide(obj, 'left');
      })
      obj['btnRight'].addEventListener('click', function(event) {
        carouselCore.slide(obj, 'right');
      })
    }

    obj['container'].addEventListener('wheel', function(event) {
      carouselCore.scrollHandler(event, obj);
    }, {passive: false});

    obj['container'].addEventListener('mousedown', function(event) {
      let eventInformation = {x : event.screenX, y : event.screenY, calledFrom : obj};
      carouselCore['swipeInformation'] = eventInformation;
      setTimeout(function() {carouselCore[ 'swipeInformation'] = {} }, 2500);
    });

    obj['container'].addEventListener('touchstart', function(event) {
      let eventInformation = {x : event.changedTouches[0].screenX, y : event.changedTouches[0].screenY, calledFrom : obj};
      carouselCore['swipeInformation'] = eventInformation;
      setTimeout(function() {carouselCore[ 'swipeInformation'] = {} }, 2500);
    });

    obj['container'].addEventListener('mouseup', function(event) {
      if (carouselCore['swipeInformation']) {
        carouselCore.swipe(event.screenX, event.screenY);
      }
    });

    obj['container'].addEventListener('touchend', function(event) {
      if (carouselCore['swipeInformation']) {
        carouselCore.swipe(event.changedTouches[0].screenX, event.changedTouches[0].screenY);
      }
    });

    carouselCore.adjust(obj);
  };

  for (let item of galleryCarousel['items']) {
    item.addEventListener('click', function(event) {
      document.querySelector('.modal-gallery').classList.add('modal-gallery--show');
      modalgalleryCarousel['uncompressedImg'].src = event.target.src.replace('[.][a-zA-Z]{3,4}', '-uc.jpg').replace('@2x', '');
    });
  };
