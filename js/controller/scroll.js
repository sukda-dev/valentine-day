/*  ==================================================
    scroll.js || Update 02/07/21
    just call this function, it will auto scroll for your
    
    autoScrollToBottom      scroll screen to bottom of screen
    autoScrollToTop         scroll screen to top of screen
    autoScrollHalfScreen    scroll screen to half of screen
    ================================================== */

var speedCase = {
  slow: 2400,
  fast: 800,
  default: 1600,
};

$(document).ready(function () {
  preventScroll();
});

// prevent bad user experiance while auto scroll try to not allow user to scroll
function preventScroll() {
  $(window).on("mousewheel touchstart", function () {
    $(".scroll-inner").stop();
  });
}

function autoScrollToBottom(speed = "default") {
  var mainScrollClass = $(".scroll-inner");
  var scrollHeight = mainScrollClass.prop("scrollHeight");
  var innerHeight = mainScrollClass.innerHeight();
  mainScrollClass.stop().animate({ scrollTop: scrollHeight - innerHeight }, speedCase[speed]);
}

function autoScrollToTop(speed = "default") {
  var mainScrollClass = $(".scroll-inner");
  mainScrollClass.stop().animate({ scrollTop: 0 }, speedCase[speed]);
}

function autoScrollHalfScreen(speed = "default") {
  var mainScrollClass = $(".scroll-inner");
  var scrollHeight = mainScrollClass.prop("scrollHeight");
  var innerHeight = mainScrollClass.innerHeight();
  mainScrollClass.stop().animate({ scrollTop: (scrollHeight - innerHeight) / 2 }, speedCase[speed]);
}
