chrome.extension.sendMessage({method: "settings"}, function(response) {
  settings = response;
  index_setuped = false;
});