//VARIABLE FOR MODULE
//NAVIGATION
var arrow_prev = $(".arrow--prev");
var arrow_next = $(".arrow--next");

var header = $("#header");
var footer = $("#footer");
var arrowDown = $("#arrow-down");

// SPECIFIC DEVICES
var isIOS =
  /iPad|iPhone|iPod/.test(navigator.platform) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
var isMobile =
  /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
    navigator.userAgent
  );
var isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(
  navigator.userAgent
);
var isIE =
  window.navigator.userAgent.indexOf("MSIE ") > 0 ||
  !!navigator.userAgent.match(/Trident.*rv\:11\./);

// TIMEOUTS
var timeouts = [],
  lockpage = [];
var intervals = [];
