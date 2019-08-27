( function() {
  var menuToggleBtn = document.querySelector('.site-nav__menu-toggle');
  var menu = document.querySelector('.site-nav__list');
  var subMenuToggleBtns = document.querySelectorAll('.site-nav__sub-menu-toggle');
  var subMenus = document.querySelectorAll('.site-nav__sub-menu');

  menuToggleBtn.addEventListener('click', function(){
    menuToggleBtn.classList.toggle('site-nav__menu-toggle--toggled');
    menu.classList.toggle('site-nav__list--open');
  });

  for (var i = 0; i < subMenus.length; i++) {
    var currentBtn = subMenuToggleBtns[i];
    var currentMenu = subMenus[i];
    currentBtn.addEventListener('click', function() {
      currentBtn.classList.toggle('site-nav__sub-menu-toggle--toggled');
      currentMenu.classList.toggle('site-nav__sub-menu--open');
    });
  };
})();
