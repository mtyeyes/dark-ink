( function() {
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
      let marginBetweenItems = +window.getComputedStyle(block['items'][0])['margin-right'].replace('px', '');
      if (block['resizeToFill']) {
        itemWidth = (document.body.clientWidth - (marginBetweenItems * (block.itemsVisible() - 1))) / block.itemsVisible();
        for (let item of block['items']) {
          item.style.width = itemWidth + 'px';
          item.style.height = itemWidth * 0.59 + 'px';
        }
      } else {
        itemWidth = block['items'][0].clientWidth;
      }
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
    swipe : function (newPointerCoordinatesX) {
      let block = this.swipeInformation.calledFrom;
      if (!block) {return}
      let pointerPath = newPointerCoordinatesX - this.swipeInformation.x;
      this.swipeInformation = {};
      if (Math.abs(pointerPath) < 60) {return}
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
      let eventInformation = {x : event.screenX, calledFrom : obj};
      carouselCore['swipeInformation'] = eventInformation;
      carouselCore.longPress = setTimeout(function() {carouselCore[ 'swipeInformation'] = {} }, 2500);
    });

    obj['container'].addEventListener('touchstart', function(event) {
      let eventInformation = {x : event.changedTouches[0].screenX, calledFrom : obj};
      carouselCore['swipeInformation'] = eventInformation;
      carouselCore.longPress = setTimeout(function() {carouselCore[ 'swipeInformation'] = {} }, 2500);
    }, {passive: true});

    carouselCore.adjust(obj);
  };

  document.addEventListener('mouseup', function(event) {
    if (carouselCore['swipeInformation']) {
      carouselCore.swipe(event.screenX);
      clearTimeout(carouselCore.longPress);
    }
  });

  document.addEventListener('touchend', function(event) {
    if (carouselCore['swipeInformation']) {
      carouselCore.swipe(event.changedTouches[0].screenX);
      clearTimeout(carouselCore.longPress);
    }
  }, {passive: true});

  //---------------------------------------------Modal Galery--------------------------------------------
  //-----------------------------------------------------------------------------------------------------

  const modalGalleryCarousel = {
    'filled' : false,
    'section' : document.querySelector('.modal-gallery'),
    'container' : document.querySelector('.modal-gallery__carousel'),
    'list' : document.querySelector('.modal-gallery__list'),
    'btnLeft' : document.querySelector('.modal-gallery__btn--previous'),
    'btnRight' : document.querySelector('.modal-gallery__btn--next'),
    'btnDownload' : document.querySelector('.modal-gallery__btn--download'),
    'btnCollapse' : document.querySelector('.modal-gallery__btn--collapse'),
    'btnClose' : document.querySelector('.modal-gallery__btn--close'),
    'imgCounter' : document.querySelector('.modal-gallery__image-counter'),
    'currentItem' : 0,
    'stopAtEdge' : false,
    'resizeToFill' : false,
    itemsVisible : function() {
      return 1;
    },
    refreshItems : function() {
      this.items = document.querySelectorAll('.modal-gallery__item');
    }
  };

  const copyImgsToCarousel = () => {
    var list = document.createDocumentFragment()
    for (let i = 0; i < galleryCarousel['items'].length; i++) {
      let galeryImg = galleryCarousel['items'][i].querySelector('img');
      let imgWrapper = document.createElement('li');
      let elementWidth
      (window.innerWidth >= 768) ? elementWidth = 320 : elementWidth = 160 ;
      imgWrapper.style.marginRight = Math.ceil(document.body.clientWidth / 2) - elementWidth + 'px';
      imgWrapper.className = 'modal-gallery__item';
      imgWrapper.dataset.id = galleryCarousel['items'][i].dataset.id;
      let img = document.createElement('img');
      img.setAttribute('loading', 'lazy');
      img.className = 'modal-gallery__uncompressed-image';
      img.src = galeryImg.src.replace('[.][a-zA-Z]{3,4}', '-uc.jpg').replace('@2x', '');
      img.alt = galeryImg.alt;
      imgWrapper.appendChild(img);
      list.appendChild(imgWrapper);
    }
    modalGalleryCarousel['list'].appendChild(list);
    modalGalleryCarousel.refreshItems();
  };

  const copyImgsToThumbnails = () => {
    var list = document.createDocumentFragment()
    for (let i = 0; i < galleryCarousel['items'].length; i++) {
      let elementToCopy;
      for (let item of galleryCarousel['items']) {
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
    document.querySelector('.modal-gallery__thumbnails').appendChild(list);
    modalGalleryCarousel['thumbnails'] = document.querySelectorAll('.modal-gallery__thumbnail');
    for (let item of modalGalleryCarousel['thumbnails']) {
      item.addEventListener('click', function(event) {
        chooseImgOnThumbnail(event.currentTarget);
      });
    };
  };

  const recalcMargin = () => {
    for (let item of modalGalleryCarousel['items']) {
      let elementWidth
      (window.innerWidth >= 768) ? elementWidth = 320 : elementWidth = 150 ;
      item.style.marginRight = Math.ceil(document.body.clientWidth / 2) - elementWidth + 'px';
    }
  }

  const fillModalGallery = (event) => {
    copyImgsToCarousel();
    copyImgsToThumbnails();
    modalGalleryCarousel['filled'] = true;
  };

  const slideToSelected = (element) => {
    for (let i = 0; i < modalGalleryCarousel['items'].length; i++) {
      if (element.dataset.id === modalGalleryCarousel['items'][i].dataset.id) {
        modalGalleryCarousel['currentItem'] = i;
      }
    }
    synchronizeModalCarousel();
    window.requestAnimationFrame(function(){carouselCore.adjust(modalGalleryCarousel)});
  }

  const synchronizeModalCarousel = () => {
    for (let i = 0; i < modalGalleryCarousel['items'].length; i++) {
      modalGalleryCarousel['thumbnails'][i].classList.remove('modal-gallery__thumbnail--selected');
      if (modalGalleryCarousel['items'][(modalGalleryCarousel['currentItem'])].dataset.id === modalGalleryCarousel['thumbnails'][i].dataset.id) {
        modalGalleryCarousel['thumbnails'][i].classList.add('modal-gallery__thumbnail--selected');
      }
    }
    modalGalleryCarousel['btnDownload'].href = modalGalleryCarousel['items'][(modalGalleryCarousel['currentItem'])].querySelector('img').src;
    modalGalleryCarousel['imgCounter'].textContent = (+modalGalleryCarousel['items'][modalGalleryCarousel['currentItem']].dataset.id + 1) + '/' + modalGalleryCarousel['items'].length;
    recalcMargin();
  }

  const showModalGallery = (event) => {
    if (!modalGalleryCarousel['filled']) {
      fillModalGallery(event);
      setEventListeners();
    }
    slideToSelected(event.currentTarget);
    document.querySelector('.modal-gallery').classList.add('modal-gallery--show');
  }

  const chooseImgOnThumbnail = (element) => {
    if (element.classList.contains('modal-gallery__thumbnail--selected')) {return}
    let selectedImg = element.dataset.id;
    for (let i = 0; i < modalGalleryCarousel['items'].length; i++) {
      if (selectedImg === modalGalleryCarousel['items'][i].dataset.id) {
        carouselCore.slideTo(modalGalleryCarousel, i);
        synchronizeModalCarousel();
        return
      }
    }
  }

  const setEventListeners = () => {
    modalGalleryCarousel['btnClose'].addEventListener('click', function(event) {
      document.querySelector('.modal-gallery').classList.remove('modal-gallery--show');
    });

    modalGalleryCarousel['btnCollapse'].addEventListener('click', function(event) {
      document.querySelector('.modal-gallery__thumbnails-wrapper').classList.toggle('modal-gallery__thumbnails-wrapper--hide');
    })

    modalGalleryCarousel['container'].addEventListener('dragstart', function(event) {
      event.preventDefault();
    });

    if (modalGalleryCarousel['btnLeft']) {
      modalGalleryCarousel['btnLeft'].addEventListener('click', function(event) {
        carouselCore.slide(modalGalleryCarousel, 'left');
        synchronizeModalCarousel();
      })
      modalGalleryCarousel['btnRight'].addEventListener('click', function(event) {
        carouselCore.slide(modalGalleryCarousel, 'right');
        synchronizeModalCarousel();
      })
    }

    modalGalleryCarousel['section'].addEventListener('wheel', function(event) {
      carouselCore.scrollHandler(event, modalGalleryCarousel);
      synchronizeModalCarousel();
    }, {passive: false});

    modalGalleryCarousel['container'].addEventListener('mousedown', function(event) {
      let eventInformation = {x : event.screenX, calledFrom : modalGalleryCarousel};
      carouselCore['swipeInformation'] = eventInformation;
      carouselCore.longPress = setTimeout(function() {carouselCore[ 'swipeInformation'] = {} }, 2500);
    });

    modalGalleryCarousel['container'].addEventListener('touchstart', function(event) {
      let eventInformation = {x : event.changedTouches[0].screenX, calledFrom : modalGalleryCarousel};
      carouselCore['swipeInformation'] = eventInformation;
      carouselCore.longPress = setTimeout(function() {carouselCore[ 'swipeInformation'] = {} }, 2500);
    }, {passive: true});

    document.addEventListener('mouseup', function(event) {
      if (carouselCore['swipeInformation']) {
        carouselCore.swipe(event.screenX);
        synchronizeModalCarousel();
        clearTimeout(carouselCore.longPress);
      }
    });

    document.addEventListener('touchend', function(event) {
      if (carouselCore['swipeInformation']) {
        carouselCore.swipe(event.changedTouches[0].screenX);
        synchronizeModalCarousel();
        clearTimeout(carouselCore.longPress);
      }
    }, {passive: true});

    window.addEventListener('resize', function(event) {
        carouselCore.adjust(modalGalleryCarousel);
        recalcMargin();
    });
  }

  for (let item of galleryCarousel['items']) {
    item.addEventListener('click', function(event) {
      showModalGallery(event);
    });
  };
})();
