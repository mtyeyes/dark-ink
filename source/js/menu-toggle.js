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
