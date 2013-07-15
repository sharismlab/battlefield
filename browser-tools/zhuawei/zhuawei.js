var settings = {
  webserver: "http://localhost:8080",
  searchserver: "http://localhost:9200",
  index: "news"
};

var retag = /#([^#]+)#/g;
var reping = /@([\u4e00-\u9fa5a-zA-Z0-9_-]{4,30})/g;

function matches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var results = [];
    var match;
    while (match = regex.exec(string)) {
        results.push(match[index]);
    }
    return results;
}

function fire() {
  console.log("fire!");

  var ids = _.map($('dl.feed_list'), function(dl) { return $(dl).attr('mid'); });
  var authors = _.filter($('dd.content p[node-type="feed_list_content"] > a') , function(a) { return $(a).attr('href').indexOf("http://weibo.com/") === 0; });
  var dates = _.map($('dd.content p.info a.date'), function(a) { var t = $(a).attr('title'); return t.split(' ').join('T') + "+08:00"; });
  var tweets = _.filter($('dd.content p[node-type="feed_list_content"] > em'), function(em) { return em.className === ""; });

  console.log(ids);
  console.log(authors);
  console.log(dates);
  console.log(tweets);

  if (ids.length === authors.length && ids.length === tweets.length) {
    _(_.zip(ids, authors, tweets, dates)).each(function (entry, idx) {
        var id = entry[0], user = $(entry[1]), tweet = $(entry[2]), date = entry[3];
        var msg = tweet.text();
        $.ajax({
          type: "POST",
          url: settings.searchserver + "/" + settings.index + "/tweets/" + id,
          processData: false,
          contentType: 'application/json',
          data: JSON.stringify({
            timestamp: date,
            username: user.text(),
            userurl: user.attr('href'),
            message: msg,
            tags: matches(msg, retag),
            pings: matches(msg, reping)
          })
        });
    });
  }
}

chrome.extension.sendMessage({method: "settings"}, function(response) {
  settings = response;
});

chrome.extension.sendMessage({method: "fetch"}, function(response) {
  if ($(location).attr('href').indexOf('http://s.weibo.com/weibo/') === 0) {
    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        console.log("hello!");
        fire();
      }
    }, 10);
  }
});
