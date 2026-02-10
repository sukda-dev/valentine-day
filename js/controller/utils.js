//Create Cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}
//END Create Cookie

//get lageuage parameter frome URL
function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split("&");
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}
//END get lageuage parameter frome URL

//Hide Navigation
function hideNavigation(navigationPrev, navigationNext) {
  if (typeof navigationPrev != "undefined") {
    navigationPrev.fadeOut();
  }

  if (typeof navigationNext != "undefined") {
    navigationNext.fadeOut();
  }
}

//Show Navigation
function showNavigation(navigationPrev, navigationNext) {
  if (typeof navigationPrev != "undefined") {
    navigationPrev.fadeIn();
  }

  if (typeof navigationNext != "undefined") {
    navigationNext.fadeIn();
  }
}

function clearAllTimeout() {
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }

  timeouts = [];
}

function clearAllInterval() {
  for (var i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
  intervals = [];
}

function lockNext() {
  if ($.inArray($(".page").attr("id"), lockpage) === -1) {
    arrow_next.addClass("locked");
    $(".arrow--next").addClass("locked");
  }
}

function unlockNext() {
  if ($.inArray($(".page").attr("id"), lockpage) === -1) {
    lockpage.push($(".page").attr("id"));
  }
  arrow_next.removeClass("locked");
  $(".arrow--next").removeClass("locked");
}

function nextPulse() {
  $(".arrow--next .arrow__inner").arrowPulse();
}

function nextStop() {
  $(".arrow--next .arrow__inner").clearAnim();
}

$.fn.offClick = function () {
  $(this).css("pointerEvents", "none");
};

$.fn.onClick = function () {
  $(this).css({
    pointerEvents: "auto",
    cursor: "pointer",
  });
};

//-----------------------------------------------
//      Preload Imgage
//-----------------------------------------------
$.preloadImages = function () {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
  }
};

function isEmpty(el) {
  return !$.trim(el.html());
}

// - How to use -
// setTimeout(function () {
//   removeBr({
//     elem: $("#chap1-game .diamond__desc"), // if have more than one use "," ex:$("#chap1-game .diamond__desc,#chap1-game .ins"),
//     device_version: "mobile", //default mobile
//   });

//   removeBr({
//     elem: $("#chap1-game .diamond__content"),
//     device_version: "desktop",
//   });
// }, 50);

function removeBr(ob_data) {
  if (typeof ob_data.device_version == "undefined")
    ob_data.device_version = "mobile";
  if (ob_data.device_version == "mobile" ? isMobile : !isMobile) {
    checkDataType(ob_data.elem);
  } else {
    if (ob_data.elem1) {
      checkDataType(ob_data.elem1);
    }
  }

  function checkDataType(txtData) {
    if (Array.isArray(txtData)) {
      txtData.each(function (index, element) {
        $(this).each(function (index1, element1) {
          $(this).html(
            $(this)
              .html()
              .replace(/<br\s*[\/]?>/gi, " ")
          );
        });
      });
    } else {
      txtData.each(function (index, element) {
        $(this).html(
          $(this)
            .html()
            .replace(/<br\s*[\/]?>/gi, " ")
        );
      });
    }
  }
}
