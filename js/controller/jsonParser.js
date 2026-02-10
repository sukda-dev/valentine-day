var jsonDoc;
var urlData = "../../json/";
var path = window.location.pathname;

function loadLocalizableResources(resourcePath, callbackFunction) {
  //resourcePath += ".ascx";
  urlData = resourcePath; // ((typeof lan != 'undefined' && lan != null) ? ("." + lan) : "") +  ".resx.json";

  $.getJSON(urlData)
    .done(function (data) {
      jsonParser(data);
    })
    .fail(function (jqxhr, textStatus, error) {
      callbackFunction();
    });

  function jsonParser(json) {
    $("body").trigger("jsonReady");
    createVariablesFromJson(json);
    doLocalize();
  }

  function createVariablesFromJson(jsonDoc) {
    $.each(jsonDoc, function (k, v) {
      window[v.key] = replaceServiceCharacters(v.data.value);
    });

    if (typeof callbackFunction == "function") {
      callbackFunction();
    }
  }
}

function replaceServiceCharacters(text) {
  text = replaceAll(text, "[nbsp]", "&nbsp;");
  text = replaceAll(text, "[", "<");
  text = replaceAll(text, "]", ">");
  text = replaceAll(text, "\\n", "<br>");
  return text;
}

function replaceAll(string, find, replace) {
  var index = string.indexOf(find);

  while (index != -1) {
    string = string.replace(find, replace);
    index = string.indexOf(find);
  }
  return string;
}

function querySt(Key) {
  var url = window.location.href;
  KeysValues = url.split(/[\?&]+/);
  for (var i = 0; i < KeysValues.length; i++) {
    var KeyValue = KeysValues[i].split("=");
    if (KeyValue[0] == Key) {
      return KeyValue[1];
    }
  }
}

function doLocalize() {
  $((typeof containerSelector == "undefined" ? "" : containerSelector + " ") + "[lcz]").each(function () {
    $(this).html(window[$(this).attr("lcz")]);
  });
}
