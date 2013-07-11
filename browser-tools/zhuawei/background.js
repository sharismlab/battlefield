//chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//  if (tab && tab.url && tab.url.indexOf('http://s.weibo.com/weibo/') === 0) {
//    chrome.pageAction.show(tabId);
//  }
//});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);

    chrome.pageAction.onClicked.addListener(function(tab) {
      if (tab && tab.url && tab.url.indexOf('http://s.weibo.com/weibo/') === 0) {
        console.log("clicked!");
        sendResponse();
      }
    });

    return true;
  }
);


