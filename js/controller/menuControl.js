// ==================================================
// MENU CONTROL
// ==================================================
//MENU
var navMenu = $("#menu");
var menuClose = $("#menu-close");
var menuList = $(".menu_list li");

function menuControl() {
  navMenu.on("click", function () {
    openMenu();
  });

  menuClose.on("click", function () {
    closeMenu();
  });

  menuList.on("click", function () {
    var pageName = $(this).data("goto");
    closeMenu();
    goto(pageName);
  });
}

function openMenu() {
  $(".menu-overlay").fadeIn();
  gsap.fromTo(
    ".menu-overlay .menu",
    { x: -50 },
    {
      x: 0,
      duration: 0.7,
      onComplete: function () {
        $(".menu-overlay .menu").clearAnim();
      },
    }
  );
}

function closeMenu() {
  $(".menu-overlay").offClick();
  clearAllTimeout();
  gsap.to(".menu-overlay .menu", {
    x: -50,
    duration: 0.7,
    onComplete: function () {
      $(".menu-overlay .menu,.menu-overlay .close").clearAnim();
      $(".menu-overlay").onClick();
    },
  });
  $(".menu-overlay").fadeOut();
}
