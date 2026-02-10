$(function () {
  setNavigationButtonsClickListeners();
});

function setNavigationButtonsClickListeners() {
  $("#main-container").on("click", "#nextButton,.arrow--next", function () {
    if (
      !$("#nextButton").hasClass("clicked") &&
      !$("#previousButton").hasClass("clicked")
    ) {
      $("#nextButton").addClass("clicked");
      $("#previousButton").addClass("clicked");
      setTimeout(function () {
        $("#nextButton,#previousButton").removeClass("clicked");
      }, 1000);
      if (typeof onNextButtonClicked == "function") {
        if (!$(this).hasClass("locked")) {
          onNextButtonClicked();
        }
      }
    }
  });
  $("#main-container").on("click", "#previousButton,.arrow--prev", function () {
    if (
      !$("#nextButton").hasClass("clicked") &&
      !$("#previousButton").hasClass("clicked")
    ) {
      $("#nextButton").addClass("clicked");
      $("#previousButton").addClass("clicked");
      setTimeout(function () {
        $("#nextButton,#previousButton").removeClass("clicked");
      }, 1000);
      if (typeof onPreviousButtonClicked == "function") {
        if (!$(this).hasClass("locked")) {
          onPreviousButtonClicked();
        }
      }
    }
  });
}

function goto(page) {
  loadPage(
    "templates/" + page + ".html",
    "js/pages/" + page + ".js",
    page + ".json",
  );
}

/*  loadPage life cycle
 *  1. clear the time interval / clear arrow animation
 *  2. empty the content
 *  3. load new content according to page
 *  4. apply the header/footer
 *  5. apply the theme
 */
function loadPage(pagePath, script, json, callback) {
  // nextStop();
  clearAllTimeout();
  clearAllInterval();
  // footer.fadeOut();
  // arrowDown.fadeOut();

  $("#content").fadeOut(400, function () {
    $(this)
      .empty()
      .load(pagePath, function () {
        componentControl(function () {
          header.removeClass("absolute");
          $("#main-container").attr("class", "");
          $("#main-container").attr("class", pagePath.slice(10, -5));
          arrow_next.removeClass("locked");

          initLoadPage();
          if (typeof callback == "function") {
            callback();
          }
        });
      });
  });

  function initLoadPage() {
    loadLocalizableResources(
      "data/" + getCookie("lang") + "/" + json,
      function () {
        // LOAD JS
        $.getScript(script, function () {
          $("#main-container").fadeInByOpacity();
          $("#content").fadeIn(500);
          $("#loading").fadeOut();
        });
        // inArrayNavMod();

        // SPECIFIC PAGE NAME
        var getName = $(".page").data("menu");
        $(".nav__page").hide();
        $(".nav__page.name" + getName).fadeIn();

        // HANDLE SCROOL DOWN
        handleScrollDown();
      },
    );
  }
}

function inArrayNavMod() {
  var pageName = $(".page").attr("id");
  var hideFooter = [];
  var hideHeader = [];
  var showAllNavigation = [];

  // HIDE HEADER
  if (hideHeader.includes(pageName)) {
    header.hide();
  } else {
    header.fadeIn();
  }

  // HIDE FOOTER
  if (hideFooter.includes(pageName)) {
    footer.hide();
  } else {
    footer.fadeInByFlex();
  }

  // SHOW ALL NAVIGATION
  if (showAllNavigation.includes(pageName)) {
    showNavigation(arrow_prev, arrow_next);
  }
}

// CHECK SCROLL DOWN
function handleScrollDown() {
  var pageName = $(".page").attr("id");
  var hideArrowDown = [];

  if (
    !hideArrowDown.includes(pageName) &&
    $(window).innerWidth() < $(window).innerHeight()
  ) {
    timeouts.push(
      setTimeout(function () {
        var mainScrollClass = $(".scroll-inner");
        var scrollHeight = mainScrollClass.prop("scrollHeight");
        var innerHeight = mainScrollClass.innerHeight();

        if (scrollHeight - innerHeight > 10) {
          arrowDown.fadeInByFlex();
          arrowDown.downPulse();
        }
      }, 500),
    );

    $(".scroll-inner").one("scroll", function () {
      arrowDown.fadeOut(function () {
        arrowDown.clearAnim();
      });
    });

    arrowDown.off("click");
    arrowDown.one("click", function () {
      autoScrollToBottom();
    });
  }
}
