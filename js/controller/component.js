function componentControl(callback) {
  var components = $("html").find("component");

  for (var i = 0; i < components.length; i++) {
    var component = $(components[i]);
    var pagePath = component.attr("src");

    if (!component.hasClass("appear")) {
      component.addClass("appear");
      component.load(pagePath);
    }
  }

  callback();
}
