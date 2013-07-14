//chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//  if (tab && tab.url && tab.url.indexOf('http://s.weibo.com/weibo/') === 0) {
//    chrome.pageAction.show(tabId);
//  }
//});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.method === "fetch") {
      chrome.pageAction.show(sender.tab.id);
      chrome.pageAction.onClicked.addListener(function(tab) {
        if (tab && tab.url && tab.url.indexOf('http://s.weibo.com/weibo/') === 0) {
          console.log("clicked!");
          sendResponse();
        }
      });
    }
    if (request.method === "settings") {
      sendResponse({
        webserver: localStorage['webserver'],
        searchserver: localStorage['searchserver'],
        index: localStorage['index']
      });
    }

    return true;
  }
);


