/*  ==================================================
    responsive.js || Update 05/06/21

    mode:                   single service
    to use:                 just complie this file with your project, and call responsive(), it will auto resize the element
    support:                desktop, mobile, tablet

    feature:
    calculateScreenSize:    adjust the scale of html font size
================================================== */

const responsive = {
  init: () => {
    responsive.setScreen();
    responsive.updateHtmlFontSize();
    $(window).resize(() => {
      responsive.setScreen();
      responsive.updateHtmlFontSize();
    });
  },

  setScreen: () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const $mainContainer = $("#main-container");

    responsive.setHeight($mainContainer);
    $mainContainer.css("width", "100%");

    if (isMobile && !isTablet) {
      $mainContainer.css("width", width);
    } else if (isTablet) {
      $mainContainer.css("width", (height * 1080) / 1920);
    } else if (width <= height && (width / 3) * 4 >= height) {
      $mainContainer.css("width", (height * 1080) / 1920);
    } else if (width <= height) {
      $mainContainer.css("width", width);
    } else {
      $mainContainer.css("width", (height * 1080) / 1920);
    }
  },

  setHeight: ($element) => {
    let newHeight = window.innerHeight;
    if (typeof mobileSafari === "string") {
      newHeight += 60;
    }
    $element.css("height", newHeight);
  },

  calculateScreenSize: () => {
    var width = window.innerWidth;
    var height = window.innerHeight;

    // screen is mobile
    if (isMobile && !isTablet) {
      scale = (width * 62.5) / 320;
      $("html").css("font-size", scale + "%");
      return scale;
    }
    // screen is more than 768
    if (width >= height) width = (height * 1080) / 1920;
    // screen is less than 768 but ratio is more than 4:3 (like 4:3.1)
    else if (width <= height && (width / 3) * 4 >= height)
      width = (height * 1080) / 1920;
    scale = (width * 62.5) / 320;

    $("html").css("font-size", scale + "%");
    return scale;
  },

  updateHtmlFontSize: () => {
    const scale = responsive.calculateScreenSize();
    document.documentElement.style.fontSize = `${scale}%`;
  },
};
