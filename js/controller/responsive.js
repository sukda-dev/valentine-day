/*  ==================================================
    responsive.js || Update 14/03/22
  
    mode:                   single service
    to use:                 just complie this file with your project, and call responsive(), it will auto resize the element
    support:                desktop, mobile, tablet
  
    feature:
    calculateScreenSize:    adjust the scale of html font size
================================================== */

function responsive() {
  calculateScreenSize();
  $(window).resize(function () {
    calculateScreenSize();
  });

  // calculate the scale of html font size
  function calculateScreenSize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var screenDesignDesktopHeight = 1080;
    var screenDesignMobileWidth = 1080;
    var scale;
    var html = document.querySelector("html");

    if ((width > height || width > 768) && width / height >= 1.5) scale = (height / screenDesignDesktopHeight) * 100;
    else if ((width > height || width > 768) && width / height < 1.5) scale = (height / 1080) * 100 * 0.7;
    else if (width <= 768) scale = (width / screenDesignMobileWidth) * 100;

    html.style.fontSize = scale + "%";
  }
}
