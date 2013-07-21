chrome.extension.sendMessage({method: "fetch"}, function(response) {
  if ($(location).attr('href').indexOf('http://s.weibo.com/weibo/') === 0) {
    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        console.log("hello!");
        Zhuawei.checkAndFire();
      }
    }, 10);
  }
});
